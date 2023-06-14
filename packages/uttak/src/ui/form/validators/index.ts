type InputValue = string | number;

export function required(v: InputValue): string | boolean {
  if (v === null || v === undefined || v === '') {
      return 'Du må oppgi en verdi';
  }
  return true;
}
