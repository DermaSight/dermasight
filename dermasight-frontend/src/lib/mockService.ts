export interface LibraryArticle {
	id: string;
	title: string;
	category: string;
	description: string;
	imageUrl: string;
	readTime: string;
	doctorName: string;
	doctorTitle: string;
	doctorAvatar: string;
	content: string[];
}

const IMAGES = {
	routine:
		"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=60",
	winter:
		"https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=60",
	acne: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60",
	melanoma:
		"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
	doctorMale:
		"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60",
	doctorFemale:
		"https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150&auto=format&fit=crop&q=60",
};

export const LIBRARY_ARTICLES: LibraryArticle[] = [
	{
		id: "art-1",
		title: "How to Build a Skincare Routine for Eczema",
		category: "Skincare Tips",
		description:
			"Keep skin hydrated and flares at bay with this simple dermatologist-approved morning and evening routine.",
		imageUrl: IMAGES.routine,
		readTime: "4 min read",
		doctorName: "Dr. Clara Chen",
		doctorTitle: "Board-Certified Dermatologist",
		doctorAvatar: IMAGES.doctorFemale,
		content: [
			"Eczema, or atopic dermatitis, requires specialized hydration that supports a damaged skin barrier. When choosing products, the key is strictly avoiding common irritants like denatured alcohol, essential oils, and synthetic fragrances.",
			"Morning Routine: Wash gently with lukewarm water only. Apply a hydrating toner rich in beta-glucan or hyaluronic acid while skin is damp. Seal this immediately with a cream containing ceramides, and finish with a physical mineral sunscreen (zinc oxide).",
			"Evening Routine: Cleanse with a mild, non-foaming cream cleanser. While the skin is still slightly wet, apply a rich emollient ointment. Layering petroleum jelly or squalane oil over your moisturizer locks in vital lipids overnight.",
		],
	},
	{
		id: "art-2",
		title: "Winter Skin Guide: Fighting Dryness and Flare-ups",
		category: "Dry Skin",
		description:
			"As temperatures drop and indoor heating rises, protect your skin barrier with these essential tips.",
		imageUrl: IMAGES.winter,
		readTime: "5 min read",
		doctorName: "Dr. Marcus Vance",
		doctorTitle: "Dermatology Specialist",
		doctorAvatar: IMAGES.doctorMale,
		content: [
			"Winter weather presents a double whammy for sensitive skin: freezing, dry winds outside, and dehydrating radiators inside. This combination evaporates skin moisture rapidly, leading to micro-cracks and flares.",
			"To combat this, switch from lightweight lotions to thick barrier creams. Look for creams labeled as 'lipids replacement' containing a 3:1:1 ratio of ceramides, cholesterol, and fatty acids.",
			"Additionally, place a humidifier in your bedroom to keep ambient humidity above 40%, and limit shower times to under 10 minutes. Hot water strips natural skin sebum, making dry skin significantly worse.",
		],
	},
	{
		id: "art-3",
		title: "Understanding Acne Triggers and Prevention",
		category: "Acne",
		description:
			"Explore the internal and external factors that cause acne breakouts and how to successfully manage them.",
		imageUrl: IMAGES.acne,
		readTime: "3 min read",
		doctorName: "Dr. Clara Chen",
		doctorTitle: "Board-Certified Dermatologist",
		doctorAvatar: IMAGES.doctorFemale,
		content: [
			"Acne is a multi-factorial condition. It primarily stems from excess sebum production, pore blockage from dead keratinocytes, and colonization by Cutibacterium acnes bacteria.",
			"Common triggers include hormonal surges (which enlarge sebaceous glands), high-glycemic diets that spike insulin levels, and friction from tight clothing or cell phone screens.",
			"To prevent breakouts, wash daily with a chemical exfoliant like salicylic acid (BHA) to deep-clean pores, use oil-free moisturizers, and try topical retinoids to accelerate cellular turnover.",
		],
	},
	{
		id: "art-4",
		title: "Spotting the Signs: The ABCDEs of Melanoma",
		category: "Melanoma Awareness",
		description:
			"A clear guide to monitoring your skin growths and recognizing when to book a professional screening.",
		imageUrl: IMAGES.melanoma,
		readTime: "6 min read",
		doctorName: "Dr. Marcus Vance",
		doctorTitle: "Oncology Dermatologist",
		doctorAvatar: IMAGES.doctorMale,
		content: [
			"Melanoma is highly curable when detected early, but it can be life-threatening if ignored. Every adult should conduct a self-skin examination once a month.",
			"Remember the ABCDE criteria: A is for Asymmetry (moles should be symmetrical), B is for Border (benign moles have smooth borders), C is for Color (moles should be a single shade), D is for Diameter (should be under 6mm), and E is for Evolving.",
			"If you notice a mole that stands out from others (the 'ugly duckling' sign) or is actively changing in size or itching, schedule a professional clinical screening immediately.",
		],
	},
];
