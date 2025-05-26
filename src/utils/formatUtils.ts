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
    // Remove other special characters but keep mathematical symbols and LaTeX
    .replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?~`]/g, (match) => {
      // Keep mathematical symbols and LaTeX commands
      if (/[\\]|[{}]|\^|_|\$/.test(match)) {
        return match;
      }
      return '';
    })
    // Clean up multiple spaces and newlines
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

// Prepare text for MathJax rendering by converting common patterns to LaTeX
export const prepareMathContent = (text: string): string => {
  return text
    // Convert LaTeX fractions that are already properly formatted
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
    
    // Convert basic fraction patterns
    .replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
    .replace(/frac(\d+)(\d+)/g, '\\frac{$1}{$2}')
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    
    // Convert trigonometric functions
    .replace(/\bsin\s*/g, '\\sin ')
    .replace(/\bcos\s*/g, '\\cos ')
    .replace(/\btan\s*/g, '\\tan ')
    .replace(/\bcot\s*/g, '\\cot ')
    .replace(/\bsec\s*/g, '\\sec ')
    .replace(/\bcsc\s*/g, '\\csc ')
    
    // Convert degree symbols
    .replace(/(\d+)°/g, '$1^\\circ')
    
    // Convert square roots
    .replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}')
    .replace(/\\sqrt(\d+)/g, '\\sqrt{$1}')
    .replace(/sqrt(\d+)/g, '\\sqrt{$1}')
    
    // Convert superscripts and subscripts
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/_(\d+)/g, '_{$1}')
    
    // Convert Greek letters
    .replace(/\\alpha\b/gi, '\\alpha')
    .replace(/\\beta\b/gi, '\\beta')
    .replace(/\\gamma\b/gi, '\\gamma')
    .replace(/\\delta\b/gi, '\\delta')
    .replace(/\\epsilon\b/gi, '\\epsilon')
    .replace(/\\theta\b/gi, '\\theta')
    .replace(/\\lambda\b/gi, '\\lambda')
    .replace(/\\mu\b/gi, '\\mu')
    .replace(/\\pi\b/gi, '\\pi')
    .replace(/\\sigma\b/gi, '\\sigma')
    .replace(/\\tau\b/gi, '\\tau')
    .replace(/\\phi\b/gi, '\\phi')
    .replace(/\\omega\b/gi, '\\omega')
    
    // Convert mathematical operators
    .replace(/\\pm\b/g, '\\pm')
    .replace(/\\mp\b/g, '\\mp')
    .replace(/\\times\b/g, '\\times')
    .replace(/\\div\b/g, '\\div')
    .replace(/\\cdot\b/g, '\\cdot')
    .replace(/\\infty\b/g, '\\infty')
    .replace(/\\sum\b/g, '\\sum')
    .replace(/\\int\b/g, '\\int')
    
    // Convert comparison operators
    .replace(/\\geq\b/g, '\\geq')
    .replace(/\\leq\b/g, '\\leq')
    .replace(/\\neq\b/g, '\\neq')
    .replace(/\\approx\b/g, '\\approx')
    .replace(/>=/g, '\\geq')
    .replace(/<=/g, '\\leq')
    .replace(/!=/g, '\\neq')
    .replace(/~=/g, '\\approx');
};

// Legacy function for backward compatibility
export const formatMathematicalSymbols = (text: string): string => {
  return prepareMathContent(text);
};

// Generate and download PDF with properly formatted math
export const downloadAsPDF = (content: string, filename: string = 'document.pdf') => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  // Clean and format the content
  const cleanContent = prepareMathContent(cleanAIResponse(content));
  
  // Create HTML content for PDF with MathJax support
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <script>
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
            displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
            processEscapes: true,
            processEnvironments: true
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
          }
        };
      </script>
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
        .fraction {
          font-size: 18px;
          font-weight: bold;
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
          // Wait for MathJax to process before printing
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 2000);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
