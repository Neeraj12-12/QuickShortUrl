import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ModalContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
};

const ModalHeader = ({ children }) => {
  return (
    <div className="bg-gray-100 rounded-t-lg px-6 py-4 border-b">
      {children}
    </div>
  );
};

const ModalTitle = ({ children }) => {
  return (
    <h3 className="text-lg font-medium text-gray-800">{children}</h3>
  );
};

const ModalContent = ({ children }) => {
  return (
    <div className="p-6">{children}</div>
  );
};

const ModalFooter = ({ children }) => {
  return (
    <div className="bg-gray-100 rounded-b-lg px-6 py-4 border-t flex justify-end space-x-2">
      {children}
    </div>
  );
};

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalContainer
};