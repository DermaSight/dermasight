export const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (err) => reject(err));
		image.setAttribute("crossOrigin", "anonymous"); // avoid CORS issues for loaded images
		image.src = url;
	});

export interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Crops an image URL according to pixelCrop area, resizes it to 224x224 pixels,
 * and returns the cropped/resized image as a base64 Data URL.
 */
export async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area,
): Promise<string> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	// Set original crop canvas size
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// Draw cropped image onto the temporary canvas
	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	// Create a secondary canvas strictly of size 224x224
	const resizedCanvas = document.createElement("canvas");
	const resizedCtx = resizedCanvas.getContext("2d");

	if (!resizedCtx) {
		throw new Error("No 2d context for resized canvas");
	}

	resizedCanvas.width = 224;
	resizedCanvas.height = 224;

	// Use high quality image scaling
	resizedCtx.imageSmoothingEnabled = true;
	resizedCtx.imageSmoothingQuality = "high";

	// Scale and draw from temp canvas to resized canvas
	resizedCtx.drawImage(
		canvas,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		224,
		224,
	);

	// As Base64 string
	return resizedCanvas.toDataURL("image/jpeg", 0.95);
}
