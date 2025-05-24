// Clean up AI response formatting by removing special characters and converting markdown-style formatting
export const cleanAIResponse = (text: string): string => {
  return text
    // Remove markdown headers
    .replace(/#{1,6}\s*/g, '')
    // Remove bullet points and list markers
    .replace(/^\s*[-*+]\s*/gm, '')
    // Remove numbered list markers
    .replace(/^\s*\d+\.\s*/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code block markers
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove other special characters but keep mathematical symbols
    .replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?~`]/g, '')
    // Clean up multiple spaces and newlines
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

// Convert mathematical expressions to proper symbols
export const formatMathematicalSymbols = (text: string): string => {
  return text
    // Greek letters
    .replace(/\balpha\b/gi, 'α')
    .replace(/\bbeta\b/gi, 'β')
    .replace(/\bgamma\b/gi, 'γ')
    .replace(/\bdelta\b/gi, 'δ')
    .replace(/\bepsilon\b/gi, 'ε')
    .replace(/\btheta\b/gi, 'θ')
    .replace(/\blambda\b/gi, 'λ')
    .replace(/\bmu\b/gi, 'μ')
    .replace(/\bpi\b/gi, 'π')
    .replace(/\bsigma\b/gi, 'σ')
    .replace(/\btau\b/gi, 'τ')
    .replace(/\bphi\b/gi, 'φ')
    .replace(/\bomega\b/gi, 'ω')
    // Mathematical operators
    .replace(/\+\/-/g, '±')
    .replace(/\-\+/g, '∓')
    .replace(/\*\*/g, '^')
    .replace(/\binfinity\b/gi, '∞')
    .replace(/\bsum\b/gi, '∑')
    .replace(/\bintegral\b/gi, '∫')
    .replace(/\bsquare root\b/gi, '√')
    .replace(/\bsqrt\b/gi, '√')
    // Fractions (basic)
    .replace(/1\/2/g, '½')
    .replace(/1\/3/g, '⅓')
    .replace(/2\/3/g, '⅔')
    .replace(/1\/4/g, '¼')
    .replace(/3\/4/g, '¾')
    .replace(/1\/5/g, '⅕')
    .replace(/1\/6/g, '⅙')
    .replace(/1\/8/g, '⅛')
    // Superscripts for common powers
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^4\b/g, '⁴')
    .replace(/\^5\b/g, '⁵')
    // Subscripts for common chemical formulas
    .replace(/H2O/g, 'H₂O')
    .replace(/CO2/g, 'CO₂')
    .replace(/NH3/g, 'NH₃')
    // Comparison operators
    .replace(/>=/g, '≥')
    .replace(/<=/g, '≤')
    .replace(/!=/g, '≠')
    .replace(/~=/g, '≈');
};

// Generate and download PDF
export const downloadAsPDF = (content: string, filename: string = 'document.pdf') => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  // Clean and format the content
  const cleanContent = formatMathematicalSymbols(cleanAIResponse(content));
  
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .content {
          font-size: 14px;
        }
        .step {
          margin: 20px 0;
          padding: 15px;
          border-left: 3px solid #007bff;
          background-color: #f8f9fa;
        }
        .math {
          font-family: 'Cambria Math', 'Times New Roman', serif;
          font-size: 16px;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AI Generated Solution</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="content">
        ${cleanContent.split('\n\n').map((paragraph, index) => {
          if (paragraph.trim().toLowerCase().includes('step')) {
            return `<div class="step"><strong>Step ${index + 1}:</strong> ${paragraph}</div>`;
          }
          return `<p class="math">${paragraph}</p>`;
        }).join('')}
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
