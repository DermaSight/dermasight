import AnteriorTorso from "@/assets/scan/anterior-torso.png";
import HeadNeck from "@/assets/scan/head-neck.png";
import LateralTorso from "@/assets/scan/lateral-torso.png";
import LowerExtremity from "@/assets/scan/lower-extremity.png";
import OralGenital from "@/assets/scan/oral-genital.png";
import PalmsSoles from "@/assets/scan/palms-soles.png";
import PosteriorTorso from "@/assets/scan/posterior-torso.png";
import Torso from "@/assets/scan/torso.png";
import UpperExtremity from "@/assets/scan/upper-extremity.png";

export interface Anatomical {
	site: string;
	image: string;
}

export const anatomical: Anatomical[] = [
	{
		site: "head/neck",
		image: HeadNeck,
	},
	{
		site: "torso",
		image: Torso,
	},
	{
		site: "upper extremity",
		image: UpperExtremity,
	},
	{
		site: "lower extremity",
		image: LowerExtremity,
	},
	{
		site: "palms/soles",
		image: PalmsSoles,
	},
	{
		site: "oral/genital",
		image: OralGenital,
	},
	{
		site: "anterior torso",
		image: AnteriorTorso,
	},
	{
		site: "posterior torso",
		image: PosteriorTorso,
	},
	{
		site: "lateral torso",
		image: LateralTorso,
	},
];
