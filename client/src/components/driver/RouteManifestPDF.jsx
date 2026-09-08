import React, { useState } from 'react';
import { FileDown, Printer, CheckCircle, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function RouteManifestPDF({ routeData, depot, currentLang }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    if (!routeData) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(16, 185, 129); // Eco Green
      doc.rect(0, 0, 210, 26, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ECOROUTE OPTI - BANG KE HOACH TUYEN THU GOM RAC', 14, 12);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('He thong Quan ly & Toi uu hoa Lo trinh Xe Thu Gom Rac (VRP Heuristic Engine)', 14, 18);

      // Metadata Block
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('THONG TIN XE VA TAI XE', 14, 34);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Bien so xe: ${routeData.truckPlate || '51C-882.19'}`, 14, 40);
      doc.text(`Tai xe phu trach: ${routeData.driverName || 'Nguyen Van Hung'}`, 14, 45);
      doc.text(`Dien thoai lien he: ${routeData.driverPhone || '0908 111 222'}`, 14, 50);

      doc.text(`Ma chuyen: ${routeData.routeId || 'ROUTE_01'}`, 115, 40);
      doc.text(`Ngay thu gom: ${new Date().toLocaleDateString('vi-VN')}`, 115, 45);
      doc.text(`Tong tai trong: ${routeData.totalLoadKg} / ${routeData.truckCapacityKg} kg (${routeData.fillPercentage}%)`, 115, 50);

      // KPIs Box
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 55, 182, 16, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Tong cu ly: ${routeData.totalDistanceKm} km`, 20, 65);
      doc.text(`Thoi gian uoc tinh: ${routeData.totalTimeMinutes} phut`, 75, 65);
      doc.text(`Tong so diem dung: ${routeData.waypoints?.length || 0} diem`, 140, 65);

      // Stops Table
      const tableRows = (routeData.waypoints || []).map((wp, idx) => [
        idx + 1,
        wp.arrivalEta || '--:--',
        wp.name || 'Diem gom',
        wp.address || 'Khu pho',
        wp.wasteAmountKg ? `${wp.wasteAmountKg} kg` : '-',
        wp.currentTruckLoadKg ? `${wp.currentTruckLoadKg} kg` : '-',
        wp.status === 'COLLECTED' ? 'Da gom' : 'Chua gom'
      ]);

      doc.autoTable({
        startY: 76,
        head: [['STT', 'Gio ETA', 'Ten Dia Diem / Ho Dan', 'Dia Chi', 'Luong Rac', 'Luy Ke', 'Xac Nhan']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [51, 65, 85]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 45 },
          3: { cellWidth: 55 },
          4: { cellWidth: 18, halign: 'right' },
          5: { cellWidth: 18, halign: 'right' },
          6: { cellWidth: 18, halign: 'center' }
        },
        margin: { left: 14, right: 14 }
      });

      // Signature Section
      const finalY = doc.lastAutoTable.finalY + 12;
      if (finalY < 250) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('XAC NHAN CUA TAI XE', 25, finalY);
        doc.text('XAC NHAN CUA DIEU PHOI VIEN', 125, finalY);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text('(Ky va ghi ro ho ten)', 28, finalY + 5);
        doc.text('(Ky va dong dau phe duyet)', 132, finalY + 5);
      }

      // Save PDF file
      doc.save(`EcoRoute_KeHoachTuyen_${routeData.truckPlate || 'TRUCK'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={isGenerating || !routeData}
      className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-2 shadow-md transition active:scale-95 disabled:opacity-50"
      title="US13 - Xuất file PDF bản kế hoạch tuyến đường"
    >
      <FileDown size={15} className="text-eco-400" />
      <span>{isGenerating ? 'Đang xuất PDF...' : 'Tải File PDF Bản Kế Hoạch (US13)'}</span>
    </button>
  );
}
