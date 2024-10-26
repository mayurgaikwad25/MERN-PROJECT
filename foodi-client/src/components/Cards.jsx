import React, { useContext, useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider';
import Swal from 'sweetalert2'


const Cards = ({item}) => {
    const {name, image, price, recipe, _id} = item;
    const [isLiked, setIsLiked] = useState(false); // State to manage heart icon toggle
    const {user} = useContext(AuthContext)
    //console.log(user)

    const location = useLocation();
    const navigate = useNavigate();

    //add to cart btn
    const handleAddtoCart = (item) => {
        // Ensure user is logged in
        if (user && user.email) {
            const { _id, name, image, price } = item; // Destructure item properties
            const cartItem = {
                menuItemId: _id,
                name,
                quantity: 1,
                image,
                price,
                email: user.email
            };
    
            // Add item to cart via API
            fetch("http://localhost:6001/carts", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            })
            .then(res => res.json().then(data => ({status: res.status, body: data}))) // Get both status and body
            .then(({ status, body }) => {
                if (status === 201) { // Success status
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Item Added to Cart",
                        showConfirmButton: false,
                        background: '#fff',
                        timer: 1500
                    });
                } else if (status === 409) { // Conflict status (duplicate item)
                    Swal.fire({
                        position: "center",
                        icon: "warning",
                        title: "Item Already in Cart",
                        background: '#fff',
                        showConfirmButton: true
                    });
                } else {
                    // Handle other statuses
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Failed to Add Item",
                        text: body.message || "Unknown error occurred.",
                        background: '#fff',
                        showConfirmButton: true
                    });
                }
            })
            .catch((error) => {
                // Catch any errors
                console.error('Error adding to cart:', error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to Add Item",
                    background: '#fff',
                    text: error.message,
                    showConfirmButton: true
                });
            });
        } else {
            // Prompt user to sign in
            Swal.fire({
                title: "Please Login",
                text: "Please create Account or Login",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Signup Now!"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/signup', { state: { from: location } });
                }
            });
        }
    };
    
    

    const handleLikeToggle = () => {
        setIsLiked(!isLiked); // Toggle the heart icon on click
    };
  return (
    
    <div className="card  bg-base-100 w-78 shadow-xl">
        <div className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${isLiked ? "text-rose-500" : "text-white"} `}
        onClick={handleLikeToggle}>
            <FaHeart className='h-5 w-5  cursor-pointer'/>
        </div>
        <Link  to={`/menu/${item._id}`}>
        <figure>
            <img src={item.image} alt="" className="hover:scale-105 transition-all duration-200 md:h-72" />
        </figure>
        </Link>
        <div className="card-body">
        <Link to={`/menu/${item._id}`}><h2 className="card-title">{item.name}</h2></Link>
        <p>Description of the item</p>
        <div className="card-actions justify-between items-center mt-2">
            <h5 className='font-semibold'><span className='text-sm text-rose-500'>$</span>{item.price}</h5>
            <button className="btn bg-green text-white" onClick={() => handleAddtoCart(item)}>Add to Cart</button>
        </div>
        </div>
    </div>
    
  )
}

export default Cards

