import { type RefObject, useEffect } from "react";

export const useClickOutside = (
	ref: RefObject<HTMLElement | null>,
	callback: () => void,
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// If the ref exists and the click target is NOT inside the ref
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, callback]);
};
