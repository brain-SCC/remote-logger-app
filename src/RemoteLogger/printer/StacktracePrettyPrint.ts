export class StacktracePrettyPrint {
  public static format(stacktrace: string) {
    return stacktrace
    .replaceAll("\n", "<br>")
  }
}
