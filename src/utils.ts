import { User } from "firebase/auth"
import { atom } from "jotai"
import { Notyf } from "notyf"
import { z } from "zod"
import { atomWithStorage } from "jotai/utils"

export const userAtom = atom<User | null | undefined>(undefined)
export const notyf = new Notyf()

export const zodRotiResponse = z.object({
	score: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
	]),
	comment: z.string().nullable().optional(),
})

export const zodRoti = z.object({
	label: z.string(),
	open: z.boolean(),
	date: z.number(),
	responses: z.record(zodRotiResponse).nullable().optional(),
})

export const rotisAtom = atom(null)

export const classNameDivRoti = (
	score: z.infer<typeof zodRotiResponse>["score"],
) => {
	switch (score) {
		case 1:
			return "bg-red-100"
		case 2:
			return "bg-red-50"
		case 3:
			return "bg-yellow-50"
		case 4:
			return "bg-green-50"
		case 5:
			return "bg-green-100"
	}
}

export const classNameDivRotiFocus = (
	score: z.infer<typeof zodRotiResponse>["score"],
) => {
	switch (score) {
		case 1:
			return "bg-red-200"
		case 2:
			return "bg-red-100"
		case 3:
			return "bg-yellow-100"
		case 4:
			return "bg-green-100"
		case 5:
			return "bg-green-200"
	}
}

export const alreadyRespondedAtom = atomWithStorage(
	"alreadyRespondedAtom",
	false,
)
