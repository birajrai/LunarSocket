import ApplyCosmeticsPacket from '../../../packets/ApplyCosmeticsPacket';
import Player from '../../Player';

export default function (player: Player, packet: ApplyCosmeticsPacket): void {
  for (const cosmetic of packet.data.cosmetics) {
    player.setCosmeticState(cosmetic.id, cosmetic.equipped);
  }
  player.clothCloak.fake = packet.data.clothCloak;

  player.adjustableHeightCosmetics = packet.data.adjustableHeightCosmetics;
  const newAdjustableHeightCosmetics: { [key: string]: number } = {};
  for (const cosmetic in packet.data.adjustableHeightCosmetics)
    if (
      Object.prototype.hasOwnProperty.call(
        packet.data.adjustableHeightCosmetics,
        cosmetic
      )
    )
      if (player.cosmetics.owned.find((c) => c.id === parseInt(cosmetic)))
        newAdjustableHeightCosmetics[cosmetic] =
          packet.data.adjustableHeightCosmetics[cosmetic];

  // Sending the new state of the cosmetics to lunar
  const newPacket = new ApplyCosmeticsPacket();
  newPacket.write({
    ...packet.data,
    cosmetics: player.cosmetics.owned,
    // Non premium users can't change clothCloak
    clothCloak: player.premium.real
      ? packet.data.clothCloak
      : player.clothCloak.real,
    adjustableHeightCosmetics: newAdjustableHeightCosmetics,
  });
  player.writeToServer(newPacket);

  player.updateDatabase();

  // No need to send the PlayerInfoPacket to other players because lunar is doing it for us :D
}
