const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Escapa texto que vai para o HTML do e-mail. O template engine substitui
 * placeholders sem escapar nada, então quem traz valor de fora (o nome do
 * Vendedor, vindo do CRM) passa por aqui antes.
 */
export const escaparHtml = (valor: string): string =>
  valor.replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const renderTemplate = (
  template: string,
  data: Record<string, string | string[] | undefined>
): string => {
  let rendered = template;

  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  rendered = rendered.replace(eachRegex, (_, arrayName, content) => {
    const array = data[arrayName];
    if (Array.isArray(array) && array.length > 0) {
      return array
        .map((item) => content.replace(/\{\{this\}\}/g, item))
        .join('');
    }
    return '';
  });

  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (_, condition, content) => {
    const value = data[condition];
    if (Array.isArray(value)) return value.length > 0 ? content : '';
    return value !== undefined && value !== null && String(value).trim() !== ''
      ? content
      : '';
  });

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = data[key];
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(', '));
    } else {
      rendered = rendered.replace(regex, String(value ?? ''));
    }
  });

  rendered = rendered.replace(/\{\{#each\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/each\}\}/g, '');
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/if\}\}/g, '');
  rendered = rendered.replace(/\{\{this\}\}/g, '');

  return rendered;
};
