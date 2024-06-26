const handleImportCSV = async <T>(processData: (data: T[]) => void, headers: string[]): Promise<void> => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';

  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;

      const rows = text.split('\n');

      const data: T[] = rows.slice(1).map((row) => {
        const columns = row.split(',');

        const item: any = {};
        headers.forEach((header, index) => {
          item[header] = columns[index];
        });

        item.id = '';
        return item;
      });

      processData(data);
    };

    reader.readAsText(file);
  };

  input.click();
};

export default handleImportCSV;
