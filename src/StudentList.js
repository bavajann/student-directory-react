import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './StudentList.css';


const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10 ;
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://strapiqa.sparts.app/api/students');
                setStudents(response.data.data);
                setFilteredStudents(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const filtered = students.filter(student => {
            const idMatch = student.id.toString().includes(searchQuery);
            const firstNameMatch = student.attributes.firstName ? student.attributes.firstName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
            const lastNameMatch = student.attributes.lastName ? student.attributes.lastName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
            const phoneMatch = student.attributes.parentContactNo ? student.attributes.parentContactNo.toLowerCase().includes(searchQuery.toLowerCase()) : false;
            const emailMatch = student.attributes.parentEmailId ? student.attributes.parentEmailId.toLowerCase().includes(searchQuery.toLowerCase()) : false;

            return idMatch || firstNameMatch || lastNameMatch || phoneMatch || emailMatch;
        });
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    if (loading) return <p className="text-center text-xl font-semibold">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prevSelected =>
            prevSelected.includes(studentId) ? prevSelected.filter(id => id !== studentId) : [...prevSelected, studentId]
        );
    };

    return (
    <div className="sidespace" >
       
        <div className="packet">
            <div className="header">
                <Layout onSearch={setSearchQuery}/>
            </div>
             <div className="content">
             <div class ="container">
                <div className='itemone'>
             <h1 className="left item1">Select school</h1>
             <form className='item2'><select name="School-Name">
             <option value="Big-Ben">Big Ben</option>
                <option value="American-School">American school</option></select></form>
                </div>
            
        <i class="fas fa-filter"></i>
    
             <button className="buttonright item3">+ Add Student</button>
            </div>

                <div className="table-container">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.length === currentStudents.length}
                                        onChange={() => {
                                            const allStudentIds = currentStudents.map(student => student.id);
                                            setSelectedStudents(prevSelected =>
                                                prevSelected.length === currentStudents.length
                                                    ? prevSelected.filter(id => !allStudentIds.includes(id))
                                                    : [...new Set([...prevSelected, ...allStudentIds])]
                                            );
                                        }}
                                    />
                                </th>
                                <th className="py-3 px-6 text-left">S.NO</th>
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">First Name</th>
                                <th className="py-3 px-6 text-left">Last Name</th>
                                <th className="py-3 px-6 text-left">Phone Number</th>
                                <th className="py-3 px-6 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className={`border-b hover:bg-indigo-100 cursor-pointer ${selectedStudents.includes(student.id) ? 'bg-indigo-200' : ''}`}
                                >
                                    <td className="py-3 px-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => handleCheckboxChange(student.id)}
                                        />
                                    </td>
                                    <td className="py-3 px-6">{indexOfFirstStudent + index + 1}</td>
                                    <td className="py-3 px-6">{student.id}</td>
                                    <td className="py-3 px-6">{student.attributes.firstName || 'N/A'}</td>
                                    <td className="py-3 px-6">{student.attributes.lastName || 'N/A'}</td>
                                    <td className="py-3 px-6">{student.attributes.parentContactNo || 'N/A'}</td>
                                    <td className="py-3 px-6">{student.attributes.parentEmailId || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-wrapper ">
                    <div className="pagination center">
                        <button onClick={prevPage} disabled={currentPage === 1}>
                        &lt;
                        </button>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>
                        &gt;
                        </button>
                    
                    </div>
                    
                    <div className="pagination right">
                        
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span style={{ color: 'black' }}>
                                           <b>{currentPage}</b> of <b>{totalPages}</b>
                                           </span>

                        <button onClick={nextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    
                    </div>
                
                </div>
            </div>

         </div>
    </div>
    );
};

export default StudentList;
