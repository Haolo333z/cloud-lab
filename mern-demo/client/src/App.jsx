import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        studentId: "",
        name: "",
        email: ""
    });

    const [editingId, setEditingId] = useState(null);

    // ==========================
    // GET STUDENTS
    // ==========================

    const loadStudents = async () => {
        try {
            const response = await fetch("/api/students");

            const data = await response.json();

            setStudents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // ==========================
    // HANDLE INPUT
    // ==========================

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    // ==========================
    // POST / PUT
    // ==========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let response;

            if (editingId) {
                response = await fetch(`/api/students/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                });
            } else {
                response = await fetch("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Có lỗi xảy ra");
                return;
            }

            alert(
                editingId
                    ? "Cập nhật sinh viên thành công!"
                    : "Thêm sinh viên thành công!"
            );

            setForm({
                studentId: "",
                name: "",
                email: ""
            });

            setEditingId(null);

            loadStudents();
        } catch (error) {
            console.error(error);
            alert("Không thể kết nối Backend");
        }
    };

    // ==========================
    // EDIT
    // ==========================

    const handleEdit = (student) => {
        setEditingId(student._id);

        setForm({
            studentId: student.studentId,
            name: student.name,
            email: student.email
        });
    };

    // ==========================
    // DELETE
    // ==========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa sinh viên này?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/students/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Xóa thất bại");
                return;
            }

            alert("Xóa sinh viên thành công!");

            loadStudents();
        } catch (error) {
            console.error(error);
        }
    };

    // ==========================
    // CANCEL EDIT
    // ==========================

    const cancelEdit = () => {
        setEditingId(null);

        setForm({
            studentId: "",
            name: "",
            email: ""
        });
    };

    return (
        <div className="container">
            <h1>Quản lý sinh viên</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="studentId"
                    placeholder="MSSV"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="name"
                    placeholder="Họ tên"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId ? "Cập nhật" : "Thêm sinh viên"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                    >
                        Hủy
                    </button>
                )}
            </form>

            <hr />

            <h2>Danh sách sinh viên</h2>

            {students.length === 0 ? (
                <p>Chưa có sinh viên.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(student)
                                        }
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(student._id)
                                        }
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;