import EquipEmotesPacket from '../../../packets/EquipEmotesPacket';
import Player from '../../Player';

export default function (player: Player, packet: EquipEmotesPacket): void {
  const owned: number[] = [];
  const fake: number[] = [];
  packet.data.emotes.forEach((emote) => {
    if (player.emotes.owned.owned.includes(emote)) {
      // Player really has the emote, making sure it's in the owned list
      owned.push(emote);
    } else {
      // Player doesn't have the emote, making sure it's in the fake list
      fake.push(emote);
    }

    // Sending the owned emote list to the server
    const packet = new EquipEmotesPacket();
    packet.write({ emotes: owned });
    player.writeToServer(packet);
  });

  player.emotes.equipped.owned = owned;
  player.emotes.equipped.fake = fake;

  player.updateDatabase();
}
