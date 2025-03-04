import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

export const exportExcel = (data, headers, fileName) => {
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });

    // 创建工作簿并添加工作表
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 导出为 Excel 文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    });
    FileSaver.saveAs(dataBlob, fileName || '表格数据.xlsx');
};