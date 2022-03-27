import { format } from 'sql-formatter';

export class SqlPrettyPrint {
  public static format(sql: string): string {
    const sqlFormatted = format(`${sql}`, {uppercase: true, indent: '&nbsp;&nbsp;'})
    return sqlFormatted.replaceAll("\n","<br>");
  }
}
