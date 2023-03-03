import BufWrapper from '@minecraft-js/bufwrapper';
import Packet from './Packet';

export default class ApplyCosmeticsPacket extends Packet<ApplyCosmetics> {
  public static id = 20;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: ApplyCosmetics): void {
    this.data = data;

    this.buf = new BufWrapper(null, { oneConcat: true });
    this.buf.writeVarInt(ApplyCosmeticsPacket.id); // Packet ID

    this.buf.writeInt(data.cosmetics.length);
    for (const cosmetic of data.cosmetics) {
      this.buf.writeLong(cosmetic.id);
      this.buf.writeBoolean(cosmetic.equipped);
    }

    this.buf.writeBoolean(data.clothCloak);
    this.buf.writeBoolean(data.showHatAboveHelmet);
    this.buf.writeBoolean(data.scaleHatWithHeadwear);

    this.buf.writeVarInt(Object.keys(data.adjustableHeightCosmetics).length);
    for (const key in data.adjustableHeightCosmetics) {
      if (
        Object.prototype.hasOwnProperty.call(
          data.adjustableHeightCosmetics,
          key
        )
      ) {
        const element = data.adjustableHeightCosmetics[key];
        this.buf.writeInt(parseInt(key));
        this.buf.writeFloat(element);
      }
    }

    this.buf.writeInt(data.unknownInt);
    this.buf.writeBoolean(data.petFlipShoulder);
    this.buf.writeBoolean(data.unknownBooleanA);
    this.buf.writeBoolean(data.unknownBooleanB);
    this.buf.writeBoolean(data.unknownBooleanC);

    this.buf.finish();
  }

  public read(): void {
    const cosmeticsLength = this.buf.readInt();
    const cosmetics: Cosmetic[] = [];
    for (let i = 0; i < cosmeticsLength; i++) {
      cosmetics.push({
        // Returns a number and not a bigint because the `asBigInt` argument is not passed
        id: this.buf.readLong() as number,
        equipped: this.buf.readBoolean(),
      });
    }

    const clothCloak = this.buf.readBoolean();
    const showHatAboveHelmet = this.buf.readBoolean();
    const scaleHatWithHeadwear = this.buf.readBoolean();

    const adjustableHeightCosmeticsLength = this.buf.readVarInt();
    const adjustableHeightCosmetics: { [key: number]: number } = {};
    for (let i = 0; i < adjustableHeightCosmeticsLength; i++)
      adjustableHeightCosmetics[this.buf.readInt()] =
        Math.round(this.buf.readFloat() * 100) / 100;

    const unknownInt = this.buf.readInt();
    const petFlipShoulder = this.buf.readBoolean();
    const unknownBooleanA = this.buf.readBoolean();
    const unknownBooleanB = this.buf.readBoolean();
    const unknownBooleanC = this.buf.readBoolean();

    this.data = {
      cosmetics,
      clothCloak,
      showHatAboveHelmet,
      scaleHatWithHeadwear,
      adjustableHeightCosmetics,
      unknownInt,
      petFlipShoulder,
      unknownBooleanA,
      unknownBooleanB,
      unknownBooleanC,
    };
  }
}

interface Cosmetic {
  id: number;
  equipped: boolean;
}

interface ApplyCosmetics {
  cosmetics: Cosmetic[];
  clothCloak: boolean;
  showHatAboveHelmet: boolean;
  scaleHatWithHeadwear: boolean;
  adjustableHeightCosmetics: { [key: string]: number };
  unknownInt: number;
  petFlipShoulder: boolean;
  unknownBooleanA: boolean;
  unknownBooleanB: boolean;
  unknownBooleanC: boolean;
}
