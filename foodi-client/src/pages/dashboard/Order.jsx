import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Order = () => {
    const {user} = useAuth();
    console.log(user.email)
    const token = localStorage.getItem('access-token')
    const {refetch,data:orders = []}=useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const response = await fetch(`http://localhost:6001/payment?email=${user?.email}`,{
              headers:{
                authorization:`Bearer ${token}`
              }                
            })
            return response.json()
          },
    })
    // console.log(orders)
    const formatDate = (createdAt)=>{
        const createdAtDate = new Date(createdAt)
        return createdAtDate.toLocaleDateString()
    }

  return (
    <div className='section container max-w-screen-2xl  mx-auto xl:px-24 px-4'>
        <div className='bg-gradient-to-r from-#FAFAFA from-0%  to-#FCFCFC to-100%'>
            <div className='py-36 flex flex-col justify-center items-center gap-8'>
                {/* texts */}
                <div className='px-4 space-y-7'>
                    <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>Track All Your<span className='text-green'> Orders!</span></h2>
                </div>
            </div>
        </div>
        {/*Table */}
        <div>
        {
        (orders.length > 0) ? <div>
        <div className="">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>TransactionID</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="font-medium">{item.transactionId}</td>
                    <td>
                     ${item.price}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <Link to="/contact"
                        className="btn btn-sm border-none text-red bg-transparent"
                       
                      >Contact
                        
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
            </table>
          </div>
        </div>
        <hr />
        
        </div> : <div className="text-center mt-20">
            <p>Cart is empty. Please add products.</p>
            <Link to="/menu"><button className="btn bg-green text-white mt-3">Back to Menu</button></Link>
        </div>
        }
        </div>
         
    </div>
  )
}

export default Order