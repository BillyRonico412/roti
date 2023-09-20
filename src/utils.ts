import { User } from "firebase/auth"
import { atom } from "jotai"
import { Notyf } from "notyf"

export const userAtom = atom<User | null | undefined>(undefined)
export const notyf = new Notyf()
