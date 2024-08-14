export const detectDatabaseType = (connectionString: string) => {
  console.log('connectionString', connectionString)
	if (
		connectionString.includes('mysql://') ||
		connectionString.includes('Server=') ||
		connectionString.includes('Database=')
	) {
		return 'MySQL';
	} else if (connectionString.includes('postgresql://') || connectionString.includes('pg://')) {
		return 'PostgreSQL';
	} else if (
		connectionString.includes('Server=') ||
		connectionString.includes('Data Source=') ||
		connectionString.includes('Initial Catalog=')
	) {
		return 'SQL Server';
	} else if (connectionString.includes('sqlite:///') || connectionString.includes('.db')) {
		return 'SQLite';
	} else if (
		connectionString.includes('oracle:thin:@') ||
		connectionString.includes('Host=') ||
		connectionString.includes('SID=')
	) {
		return 'Oracle';
	} else if (connectionString.includes('mongodb://') || connectionString.includes('mongodb+srv://')) {
    console.log('mongodb')
		return 'MongoDB';
	} else {
		return 'Unknown Database';
	}
}