import type { Transaction } from '@/modules/transactions/transaction.types';
import { formatCentsToCurrency } from '@/utils/format';

export const exportToExcel = (transactions: readonly Transaction[], currency: string): void => {
  import('xlsx').then((xlsx) => {
    const data = transactions.map((transaction) => ({
      Data: transaction.date.toLocaleDateString('pt-BR'),
      Tipo: transaction.transactionType === 'deposit' ? 'Receita' : 'Despesa',
      Valor: formatCentsToCurrency(transaction.amountInCents, currency),
      Conta: transaction.account,
      Industria: transaction.industry,
      Estado: transaction.state,
      Status: transaction.isPending ? 'Pendente' : 'Confirmado',
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Financeiro');

    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 8 },
      { wch: 10 },
    ];

    xlsx.writeFile(workbook, 'financeiro-export.xlsx');
  });
};

export const exportToPdf = (): void => {
  Promise.all([import('jspdf'), import('html2canvas')]).then(([jsPDFModule, html2canvasModule]) => {
    const { default: jsPDF } = jsPDFModule;
    const { default: html2canvas } = html2canvasModule;

    const dashboardContent = document.querySelector('[data-dashboard-content]');
    if (!dashboardContent) {
      return;
    }

    html2canvas(dashboardContent as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.text('Relatorio Financeiro', 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 10, 22);

      let yOffset = 30;
      let remainingHeight = imgHeight;

      if (yOffset + remainingHeight <= pageHeight - 10) {
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
      } else {
        let currentPosition = 0;
        const sliceHeight = pageHeight - yOffset - 10;

        while (currentPosition < imgHeight) {
          if (currentPosition > 0) {
            pdf.addPage();
            yOffset = 10;
          }

          const sourceY = (currentPosition / imgHeight) * canvas.height;
          const sourceHeight = (sliceHeight / imgHeight) * canvas.height;

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sliceCanvas.height,
              0,
              0,
              canvas.width,
              sliceCanvas.height,
            );
          }

          const sliceData = sliceCanvas.toDataURL('image/png');
          const drawnHeight = (sliceCanvas.height / canvas.height) * imgHeight;
          pdf.addImage(sliceData, 'PNG', 10, yOffset, imgWidth, drawnHeight);

          currentPosition += sourceHeight;
          remainingHeight -= drawnHeight;
        }
      }

      pdf.save('financeiro-relatorio.pdf');
    });
  });
};
