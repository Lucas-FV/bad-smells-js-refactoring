export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   */
  generateReport(reportType, user, items) {
    const filteredItems = this._filterItemsByUser(user, items);
    
    let report = this._generateHeader(reportType, user);
    let total = 0;

    for (const item of filteredItems) {
      report += this._generateRow(reportType, user, item);
      total += item.value;
    }

    report += this._generateFooter(reportType, total);
    return report.trim();
  }

  // --- Métodos Extraídos (Extract Method) ---

  /**
   * Filtra quais itens o usuário tem permissão para visualizar
   */
  _filterItemsByUser(user, items) {
    if (user.role === 'ADMIN') {
      return items.map(item => {
        if (item.value > 1000) item.priority = true;
        return item;
      });
    }
    
    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }

    return [];
  }

  /**
   * Renderiza o cabeçalho baseado no formato
   */
  _generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    if (reportType === 'HTML') {
      return '<html><body>\n' +
             '<h1>Relatório</h1>\n' +
             `<h2>Usuário: ${user.name}</h2>\n` +
             '<table>\n' +
             '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
    }
    return '';
  }

  /**
   * Renderiza uma linha de item baseado no formato
   */
  _generateRow(reportType, user, item) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    if (reportType === 'HTML') {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return '';
  }

  /**
   * Renderiza o rodapé baseado no formato
   */
  _generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }
    if (reportType === 'HTML') {
      return '</table>\n' +
             `<h3>Total: ${total}</h3>\n` +
             '</body></html>\n';
    }
    return '';
  }
}