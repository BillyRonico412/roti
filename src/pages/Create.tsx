import { BookmarkIcon, PlusIcon } from "@heroicons/react/solid"
import { Button, TextInput } from "@tremor/react"

const Create = () => {
	return (
		<div className="container mx-auto h-full flex gap-x-4 justify-center items-center">
			<TextInput placeholder="Label du roti" icon={BookmarkIcon} />
			<Button icon={PlusIcon}>Créer</Button>
		</div>
	)
}

export default Create
