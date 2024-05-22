import Image from "next/image"
import Link from "next/link"

export function Socials() {
	return (
		<section className="text-sm flex justify-evenly items-center">
			<Link target="_blank" href={"https://discord.gg/4esport"}>
				<Image
					src={
						"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png"
					}
					width={24}
					height={24}
					alt={"discord logo"}
				/>
			</Link>
			<Link target="_blank" href={"https://github.com/Turdyo/"}>
				<Image
					src={"https://gyazo.com/85e7ce9196ae635161fec921602903a7/max_size/1000"}
					width={24}
					height={24}
					alt={"Github logo"}
				/>
			</Link>
		</section>
	)
}
