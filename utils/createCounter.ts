const DEFAULT_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const createCounter = (alphabet: string = DEFAULT_ALPHABET) => {
  const sequence: string[] = [alphabet[0]];

  return () => {
    const str = sequence.join('');

    let carry = 0;
    for (let i = 0; i < sequence.length; i++) {
      const index = alphabet.indexOf(sequence[i]) + carry + 1;

      if (index < alphabet.length) {
        sequence[i] = alphabet[index];
        carry = 0;
        break;
      } else {
        sequence[i] = alphabet[0];
        carry = 1;
      }
    }

    if (carry) sequence.push(alphabet[0]);
    return str;
  };
};
