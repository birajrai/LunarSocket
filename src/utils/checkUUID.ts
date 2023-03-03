export default function checkUUID(uuid: string): boolean {
  const match =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(
      uuid.toLowerCase()
    );
  return match;
}
