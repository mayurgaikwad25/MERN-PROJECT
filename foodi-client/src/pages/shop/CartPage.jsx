import React, { useContext, useState } from 'react'
import useCart from '../../hooks/useCart'
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2'
import { AuthContext } from '../../contexts/AuthProvider';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [cart,refetch]=useCart();
    const {user} = useContext(AuthContext)
    const [cartItems,setcartItems]= useState(cart || []);

    // useEffect(() => {
    //     setcartItems(cart || []);  // Initialize to an empty array if cart is undefined or null
    // }, [cart]);

    //calc price
    const calculatePrice =(item)=>{
        return item.price * item.quantity
    };

    //handleIncrease
    const handleIncrease = (item) => {
        fetch(`http://localhost:6001/carts/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            // Corrected JSON.stringify format
            body: JSON.stringify({ quantity: item.quantity + 1 })
        })
        .then(res => res.json())
        .then(data => {
            const updatedCart = cartItems.map((cartItem) => {
                if (cartItem._id === item._id) {
                return {
                    ...cartItem,
                    quantity: cartItem.quantity + 1
                };
                }
                return cartItem;
            });
        
            // Assuming refetch and setcartItems are defined correctly
           // refetch();  // Refresh the cart items from the server (optional)
            setcartItems(updatedCart);  // Update the cartItems state with the new quantities
        })
        refetch();
    };
      
    //handleIn dEcrease
    const handleDecrease=(item)=>{
        if(item.quantity>1){
            fetch(`http://localhost:6001/carts/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                // Corrected JSON.stringify format
                body: JSON.stringify({ quantity: item.quantity - 1 })
            })
            .then(res => res.json())
            .then(data => {
                const updatedCart = cartItems.map((cartItem) => {
                    if (cartItem._id === item._id) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity - 1
                    };
                    }
                    return cartItem;
                });
            
                // Assuming refetch and setcartItems are defined correctly
               // refetch();  // Refresh the cart items from the server (optional)
                setcartItems(updatedCart);  // Update the cartItems state with the new quantities
            })
            refetch();
        }
        else{
            alert("Item can't be Zero")
        }
    }
   
    //calc total price
    const cartSubTotal = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + calculatePrice(item), 0)
        : 0;  
    //----
    const orderTotal = cartSubTotal;

    const handleDelete = (item) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {

            if (result.isConfirmed) {
                fetch(`http://localhost:6001/carts/${item._id}`, {
                method: "DELETE"
                })
                .then(res => res.json())  // Wait for the fetch promise and parse the response as JSON
                .then(data => {
                if (data.deletedCount > 0) {
                    refetch()
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
                })
            }
        });
    };
      

   
  return (
    <div className='section container max-w-screen-2xl  mx-auto xl:px-24 px-4'>
        <div className='bg-gradient-to-r from-#FAFAFA from-0%  to-#FCFCFC to-100%'>
            <div className='py-36 flex flex-col justify-center items-center gap-8'>
                {/* trc */}
                {/* texts */}
                <div className='px-4 space-y-7'>
                    <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>Items Added to The<span className='text-green'> Cart</span></h2>
                </div>

                {/*cart*/}
                <div className='w-full py-8'>
                    <div className="overflow-x-auto w-full">
                        <table className=" table-auto min-w-full text-left">
                            {/* head */}
                            <thead className='bg-green text-white'>
                            <tr>
                                <th>#</th>
                                <th>Food</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* row 1 */}
                            {
                                cart.map((item,index)=>(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                src={item.image}
                                                alt="Avatar Tailwind CSS Component" />
                                            </div>
                                            </div>
                                        </div>
                                        </td>
                                        <td className='font-medium'>
                                        {item.name}
                                        </td>
                                        <td>
                                            <button className='btn btn-xs p-4' onClick={()=>handleDecrease(item)}>-</button>
                                            <input 
                                                type='number' 
                                                value={item.quantity} 
                                                onChange={()=>console.log(item.quantity)}
                                                className='w-10 mx-2 text-center overflow-hidden'>

                                            </input>
                                            <button className='btn btn-xs' onClick={()=>handleIncrease(item)}>+</button>
                                        </td>
                                        <td>${calculatePrice(item).toFixed(2)}</td>
                                        <th>
                                        <button className="btn btn-ghost btn-xs" onClick={()=> handleDelete(item)}><FaTrash/></button>
                                        </th>
                                    </tr>
                                )
                            )}
                            </tbody> 
                        </table>
                    </div>
                </div>

                {/* customer details*/}
                <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
                    <div className='md:w-1/2 space-y-3'>
                        <h3 className='font-medium'>Customer Details</h3>
                        <p>Name: {user?.displayName || "None"}</p>
                        <p>Email: {user?.email}</p>
                        <p>
                        User_id: <span className="text-sm">{user?.uid}</span>
                        </p>
                    </div>
                    <div className="md:w-1/2 space-y-3">
                        <h3 className="font-medium">Shopping Details</h3>
                        <p>Total Items: {cart.length}</p>
                        <p>
                        Total Price:${orderTotal.toFixed(2)}
                        </p>
                        <Link to='/process-checkout'><button className="btn btn-md bg-green text-white px-8 py-3">
                        Procceed to Checkout
                        </button></Link>
                        
                    </div>
                </div>
                
                
            </div> 
            : <div className="text-center mt-20">
                <p>Cart is empty. Please add products.</p>
                <Link to="/menu"><button className="btn bg-green text-white mt-3">Back to Menu</button></Link>
            </div>
        </div>
    </div>
  )
}

export default CartPage