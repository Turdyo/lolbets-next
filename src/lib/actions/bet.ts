"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { db } from "../prisma"

export async function bet({ amount, matchId, teamId }: { amount: number; matchId: number; teamId: number }) {
	const session = await auth()
	if (!session) return { error: "You must log in to bet !" }

	const user = session.user
	if (!user) return { error: "C'est la merde" }

	const match = await db.match.findUnique({
		where: {
			id: matchId
		},
		select: {
			id: true,
			status: true,
			bets: true,
			opponents: {
				select: {
					id: true
				}
			}
		}
	})

	if (!match) {
		return { error: "Match does not exist" }
	}
	if (match.status !== "not_started") {
		return { error: "Match has already started" }
	}
	const opponents = match.opponents.map((team) => team.id)
	if (!opponents.includes(teamId)) {
		return { error: "TeamId not in match opponents" }
	}
	if (user.points! < amount) {
		return { error: "Not enough points" }
	}
	if (amount <= 0) {
		return { error: "Bet value not allowed" }
	}
	const previousBet = match?.bets.find((bet) => bet.userId === user.id)
	if (previousBet) {
		if (previousBet.teamId !== teamId) {
			return { error: "You have betted on the other team already" }
		}
		await db.bet.update({
			where: {
				id: previousBet.id
			},
			data: {
				amount: {
					increment: amount
				}
			}
		})
	} else {
		await db.bet.create({
			data: {
				amount: amount,
				userId: user.id!,
				matchId: matchId,
				teamId: teamId
			}
		})
	}
	await db.user.update({
		where: {
			id: user.id
		},
		data: {
			points: {
				decrement: amount
			}
		}
	})
	revalidatePath("/")
}

export async function distributeBets() {

	const matchesToDistribute = await db.match.findMany({
		where: {
			status: "finished",
			bets_distributed: false
		},
		include: {
			bets: {
				include: {
					team: true
					// user: true
				}
			}
		}
	})

	for (const match of matchesToDistribute) {
		let totalWinner = 0
		let totalLooser = 0

		match.bets.forEach((bet) => {
			if (bet.teamId === match.winner_id) {
				totalWinner += bet.amount
			} else {
				totalLooser += bet.amount
			}
		})

		const total = totalLooser + totalWinner

		for (const bet of match.bets) {
			let amountRecieved = 0
			if (bet.teamId === match.winner_id) {
				amountRecieved = Math.round(total * (bet.amount / totalWinner))
			} else {
				amountRecieved = -bet.amount
			}
			await db.bet.update({
				where: {
					id: bet.id
				},
				data: {
					amountRecieved: amountRecieved,
					status: amountRecieved > 0 ? "won" : "lost"
				}
			})
			if (amountRecieved > 0) {
				await db.user.update({
					where: {
						id: bet.userId
					},
					data: {
						points: {
							increment: amountRecieved
						}
					}
				})
			}
		}

		await db.match.update({
			where: {
				id: match.id
			},
			data: {
				bets_distributed: true
			}
		})
	}
	revalidatePath("/")
}
