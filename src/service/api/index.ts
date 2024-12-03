const PATH_NAME = "transactions";

// ฟังก์ชันที่ใช้ดึงข้อมูลทั้งหมด
const getAll = async () => {
  const url = `http://localhost:3000/api/${PATH_NAME}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const res = await response.json();
  return res || [];
};

// ฟังก์ชันที่ใช้แก้ไขข้อมูล
const Update = async (id: number, updatedData: { type: string; name: string; amount: number; transactionDate: string }) => {
  const url = `http://localhost:3000/api/${PATH_NAME}/${id}`;
  
  const response = await fetch(url, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData), // ข้อมูลที่ต้องการอัพเดต
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const res = await response.json(); // รับผลลัพธ์ที่ได้รับจาก API
  return res; // ส่งข้อมูลที่ถูกอัพเดตกลับ
};

// ฟังก์ชันที่ใช้ลบข้อมูล
const Delete = async (id: number) => {
  const url = `http://localhost:3000/api/${PATH_NAME}/${id}`;

  const response = await fetch(url, {
    method: "DELETE", // ใช้ DELETE method เพื่อลบข้อมูล
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // ไม่มีข้อมูลที่ต้องรับกลับเมื่อทำการลบ
  return { message: "Transaction deleted successfully" };
};

const Transection = {
  getAll,
  Update, 
  Delete, 
};

export default Transection;
