"use client";

import { useState, useEffect } from "react";
import Transection from "@/service/api"; 

interface ReportData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const ReportPage = () => {
  const [month, setMonth] = useState("12");
  const [year, setYear] = useState("2024"); 
  const [reportData, setReportData] = useState<ReportData | null>(null); // กำหนดประเภท
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  const fetchReportData = async () => {
    setLoading(true); 
    setError(null); 

    try {
      const data = await Transection.getByMonthYear(month, year);
      setReportData(data); 
      console.log('data',data)
    } catch (err) {
      setError("Error fetching report data"); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [month, year]); 

  const formatNumber = (num: number | undefined) => {
    return num && !isNaN(num) ? num.toFixed(2) : '0.00';
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">รายงานรายรับรายจ่าย</h2>

      {/* ตัวเลือกเดือนและปี */}
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="month" className="form-label">เลือกเดือน</label>
          <select
            id="month"
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="01">มกราคม</option>
            <option value="02">กุมภาพันธ์</option>
            <option value="03">มีนาคม</option>
            <option value="04">เมษายน</option>
            <option value="05">พฤษภาคม</option>
            <option value="06">มิถุนายน</option>
            <option value="07">กรกฎาคม</option>
            <option value="08">สิงหาคม</option>
            <option value="09">กันยายน</option>
            <option value="10">ตุลาคม</option>
            <option value="11">พฤศจิกายน</option>
            <option value="12">ธันวาคม</option>
          </select>
        </div>

        <div className="col">
          <label htmlFor="year" className="form-label">เลือกปี</label>
          <select
            id="year"
            className="form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            {/* เพิ่มปีตามที่ต้องการ */}
          </select>
        </div>
      </div>

      {/* แสดงผลข้อมูล */}
      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-danger">{error}</p>}

      {reportData && (
        <div>
          <h3>รายรับและรายจ่ายสำหรับเดือน {month} ปี {year}</h3>
          <div>
            <h5>รายรับทั้งเดือน: {formatNumber(reportData.totalIncome)} บาท</h5>
            <h5>รายจ่ายทั้งเดือน: {formatNumber(reportData.totalExpense)} บาท</h5>
            <h5>ยอดคงเหลือ: {formatNumber(reportData.balance)} บาท</h5>
          </div>
        </div>
      )}

      {/* หากไม่มีข้อมูล */}
      {!loading && !reportData && !error && <p>ไม่มีข้อมูลรายงานสำหรับเดือนและปีที่เลือก</p>}
    </div>
  );
};

export default ReportPage;
