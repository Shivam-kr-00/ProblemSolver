import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title = "No items found",
  description = "There are no items to display",
  action = null,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-12 px-4 text-center"
    >
      <div className="flex justify-center mb-4">
        {Icon ? (
          <div className="p-3 bg-emerald-500/10 rounded-full">
            <Icon className="w-8 h-8 text-emerald-400" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">📭</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-emerald-200 text-sm mb-4">{description}</p>
      {action && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
