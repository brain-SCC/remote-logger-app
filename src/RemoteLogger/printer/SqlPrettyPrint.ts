import { format } from 'sql-formatter';

export class SqlPrettyPrint {
  public static format(sql: string): string {
    const sqlFormatted = format(`${sql}`, {keywordCase: "upper"})
    return sqlFormatted
      .replaceAll("\n","<br>")
      .replaceAll("  ","&nbsp;&nbsp;")
      ;
  }
}
