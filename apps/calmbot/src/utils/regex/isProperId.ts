export default (str: string) => /^[1-9]{1}[0-9]{16,18}$/gm.test(str);
