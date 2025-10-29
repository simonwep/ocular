import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';

const target = '../src/composables/available-currency-codes/currencies.json';
const source =
  'https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml';

const response = await fetch(source).then((res) => res.text());
const parsed = new XMLParser({ ignoreAttributes: false }).parse(response);
const list = parsed['ISO_4217']['CcyTbl']['CcyNtry'];

const currencies = new Set(
  list
    .filter((v) => v.Ccy)
    .filter((v) => typeof v.CcyNm === 'string' || !('@_IsFund' in v.CcyNm)) // Filter out funds
    .filter((v) => !v.Ccy.startsWith('X')) // Filter out other funds and precious metals
    .filter((v) => !v.Ccy.match(/bond|market|unit/i)) // Filter out special purpose codes
    .map((v) => v.Ccy)
);

// Remove special currency
currencies.delete('XXX');

const sortedList = Array.from(currencies).sort();
await fs.writeFile(target, JSON.stringify(sortedList) + '\n', 'utf-8');
