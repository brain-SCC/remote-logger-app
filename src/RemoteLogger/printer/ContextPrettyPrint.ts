export class ContextPrettyPrint {
  public static format(context: any): string {
    if(typeof context == "string") {
      return context.replaceAll("\n", "<br>")
    }

    if(typeof context == "object") {
      return JSON.stringify(context, null, 4)
        .replaceAll("  ","&nbsp;&nbsp;")
        .replaceAll("\n", "<br>")
    }
    
    return ""
  }
}
