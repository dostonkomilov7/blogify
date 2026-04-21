// helpers/hbs.helpers.js
import hbs from 'handlebars'; // yoki 'express-handlebars'

/**
 * Sanani formatlash:  "14 Apr 2026"
 */
export const helpers = {
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('uz-UZ', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  },

  /**
   * Muallif ismining bosh harflari (avatar uchun)
   * created_by.username = "Ali Vali"  →  "AV"
   */
  initials: (name) => {
    if (!name) return '?';
    return name.trim().split(' ')
      .map(w => w[0]?.toUpperCase() || '')
      .slice(0, 2).join('');
  },
  
  /**
   * Ikkita qiymatni solishtirish
   * {{#if (eq status "active")}} ... {{/if}}
   */
  eq: (a, b) => {a === b}
}