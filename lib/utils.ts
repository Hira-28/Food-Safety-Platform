export { cn } from "cn"

export function normalizePublicImageUrl(imageUrl: string | null | undefined) {
	if (!imageUrl?.startsWith("/")) {
		return imageUrl ?? "";
	}

	return imageUrl.replace(/\.(jpe?g|png|webp|avif)(?=([?#]|$))/i, (extension) =>
		extension.toLowerCase()
	);
}
