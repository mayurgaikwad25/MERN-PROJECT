import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { ImPaypal } from "react-icons/im";
import useAuth from "../../hooks/useAuth"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({price,cart}) => {
    const stripe = useStripe();
    const elements = useElements();
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();

    const [cardError, setcardError] = useState(' ')
    const [clientSecret, setClientSecret] = useState("");

    useEffect(()=>{
        if(typeof price !== "number" || price < 1) {
            console.log("Price is not a number or less than 1")
            return;
        }
        axiosSecure.post('/create-payment-intent',{price})
        .then(res => {
            // console.log(res.data.clientSecret)
            setClientSecret(res.data.clientSecret)
        })
        .catch(error => {
            console.error("Error fetching client secret:", error);
        });
    },[price, axiosSecure])

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
        } 
        
        if (!clientSecret) {
            console.error("Client secret is not available.");
            setcardError("Payment cannot be processed at the moment. Please try again.");
            return;
        }

        //create card element
        const card = elements.getElement(CardElement);

        if (card == null) {
        return;
        }

        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });
    
        if (error) {
            console.log('[error]', error);
            setcardError(error.message)
        } else {
            setcardError("success!")
            // console.log('[PaymentMethod]', paymentMethod);
        }

        const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                    name: user?.displayName || 'anonymous',
                    email:user?.email || 'unknown'
                    },
                },
            },
        );
        if(confirmError){
            console.log(confirmError)
        }
        // console.log(paymentIntent)
        else if(paymentIntent.status === "succeeded"){
            console.log(paymentIntent.id)
            setcardError(`Your transactionID is:${paymentIntent.id}`)
            //payment info data
            const paymentInfo = {
                email:user?.email,
                transactionId: paymentIntent.id,
                price,
                quantity:cart.length,
                status:"Order Pending",
                itemName:cart.map(item=>item.name),
                cartItems:cart.map(item=>item._id),
                menuItems:cart.map(item=>item.menuItemId)
            }
            console.log(paymentInfo)
            //send info to BAckend
            axiosSecure.post('/payment',paymentInfo)
            .then(res => {
                console.log(res.data)
                alert("Payments Successful!");
                navigate('/order')
            })
        }
         

    }


  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
        {/*left side */}
        <div className='md:w-1/2 w-full space-y-3'>
            <h4 className='texts-lg font-semibold'>Order Summary</h4>
            <p>Total Price:${price}</p>
            <p>Number of Items:{cart.length}</p>
        </div>

        {/*right side */}
        <div className='md:w-1/2 w-full space-y-5 card bg-base-100 max-w-sm shrink-0 shadow-2xl px-4 py-8'>
            <h4 className='texts-lg font-semibold'>Process Your Payment</h4>
            <h5>Credit/Debit Card</h5>
            {/*form */}
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                    style: {
                        base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                        },
                        invalid: {
                        color: '#9e2146',
                        },
                    },
                    }}
                />
                <button type="submit" disabled={!stripe} className='btn btn-sm mt-5 btn-primary w-full text-white'>
                    Pay
                </button>
            </form>
            {
                cardError ? <p className='text-red italic'>{cardError}</p> : ""
            }


            {/*paypal */}
            <div className='mt-5 text-center'>
                <hr/>
                <button
                type="submit"
                className='btn btn-sm mt-5 bg-orange-500 text-white'><ImPaypal/> Pay with Paypal</button>
            </div>

        </div>
    </div>
  )
}

export default CheckoutForm