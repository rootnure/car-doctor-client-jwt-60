import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import BookingRow from './BookingRow';
import axios from 'axios';


const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const url = `http://localhost:5000/bookings?email=${user?.email}`;
    useEffect(() => {
        axios.get(url, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                setBookings(res.data);
            })
        // fetch(url)
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data);
        //         setBookings(data);
        //     })
    }, [url])

    const handleDelete = (_id) => {
        const proceed = confirm("Are you sure you want to delete?");
        if (proceed) {
            fetch(`http://localhost:5000/booking/${_id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        const remaining = bookings.filter(booking => booking._id !== _id);
                        setBookings(remaining);
                        alert('deleted successfully');
                    }
                })
        }
    }

    const handleBookingConfirm = (_id) => {
        fetch(`http://localhost:5000/booking/${_id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ status: 'confirm' })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.modifiedCount > 0) {
                    // update status
                    const remaining = bookings.filter(booking => booking._id !== _id);
                    const updated = bookings.find(booking => booking._id === _id);
                    updated.status = 'confirm';
                    const newBooking = [updated, ...remaining];
                    setBookings(newBooking);
                }
            })
    }

    return (
        <div>
            <h2 className="text-5xl">Your Bookings: {bookings.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead className='uppercase'>
                        <tr>
                            <th></th>
                            <th>Customer Info</th>
                            <th>Service Info</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings.map(booking => <BookingRow
                                key={booking._id}
                                booking={booking}
                                handleDelete={handleDelete}
                                handleBookingConfirm={handleBookingConfirm}></BookingRow>)
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Bookings;