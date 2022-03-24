export class StacktracePrettyPrint {
  public static format(stacktrace: string) {
    return stacktrace.replace("\n", "<br>");
  }
}
