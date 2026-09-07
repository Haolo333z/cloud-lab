import { useState, useEffect } from 'react';
import './App.css';

// Backend chạy tại port 5000
const API_URL = "https://mern-backend-235871.onrender.com/api/students";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: '',
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi fetch sinh viên:', err);
      alert('Không kết nối được với server!');
    }
  };

  // Khi mở trang thì lấy danh sách sinh viên
  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // XỬ LÝ NHẬP FORM
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // THÊM / CẬP NHẬT SINH VIÊN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      // Nếu đang sửa
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
      } else {
        // Nếu thêm mới
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `HTTP ${res.status}`);
      }

      // Xóa form
      setForm({
        studentId: '',
        name: '',
        email: '',
      });

      // Thoát chế độ sửa
      setEditingId(null);

      // Tải lại danh sách
      await fetchStudents();

      alert(
        editingId
          ? 'Cập nhật thành công!'
          : 'Thêm sinh viên thành công!'
      );
    } catch (err) {
      console.error('Lỗi khi lưu sinh viên:', err);

      alert(
        'Không thể thêm/cập nhật sinh viên!\n' +
        err.message
      );
    }
  };

  // =========================
  // SỬA SINH VIÊN
  // =========================
  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });

    setEditingId(student._id);
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này không?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `HTTP ${res.status}`);
      }

      await fetchStudents();

      alert('Xóa thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa sinh viên:', err);

      alert(
        'Không thể xóa sinh viên!\n' +
        err.message
      );
    }
  };

  // =========================
  // HỦY CHỈNH SỬA
  // =========================
  const handleCancel = () => {
    setEditingId(null);

    setForm({
      studentId: '',
      name: '',
      email: '',
    });
  };

  // =========================
  // GIAO DIỆN
  // =========================
  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        fontFamily: 'sans-serif',
      }}
    >
     <h1
  style={{
    fontSize: "28px",
    lineHeight: "1.3",
    textAlign: "center",
    marginBottom: "20px"
  }}
>
  QUẢN LÝ SINH VIÊN
  <br />
  BUỔI 6 – PHIÊN BẢN 2.0
</h1>

      {/* Form nhập liệu */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: 24 }}
      >
        <input
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
        />{' '}

        <input
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />{' '}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />{' '}

        <button type="submit">
          {editingId ? 'Cập nhật' : 'Thêm'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ marginLeft: 5 }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Bảng danh sách */}
      <table
        border="1"
        cellPadding="8"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: 'center' }}
              >
                Chưa có sinh viên
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>

                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>
                  <button
                    onClick={() => handleEdit(student)}
                  >
                    Sửa
                  </button>{' '}

                  <button
                    onClick={() =>
                      handleDelete(student._id)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;