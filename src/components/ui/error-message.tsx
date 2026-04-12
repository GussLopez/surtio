'use client'

import { motion, AnimatePresence } from "motion/react";

export default function ErrorMessage({ children }: { children?: React.ReactNode }) {
	return (
		<motion.div
			animate={{ height: children ? "auto" : 0 }}
			initial={false}
			transition={{ duration: 0.25, ease: "easeInOut" }}
			className="overflow-hidden"
		>
			<AnimatePresence mode="wait">
				{children && (
					<motion.p
						key="error"
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.2 }}
						className="text-red-500 mt-1 text-xs font-medium"
					>
						{children}
					</motion.p>
				)}
			</AnimatePresence>
		</motion.div>
	)
}