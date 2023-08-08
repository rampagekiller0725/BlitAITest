import { Transition, Dialog } from "@headlessui/react";
import { Fragment, ReactNode, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { translate } from "react-range/lib/utils";

interface DraggableModalProps {
  children: ReactNode;
  visible: boolean;
  title: ReactNode;
  buttons: ReactNode;
}

const DraggableModal = (props: DraggableModalProps) => {
  const { children, visible, title, buttons } = props;
  useEffect(() => {
    document.getElementById("root")?.removeAttribute("inert");
  });

  useEffect(() => {
    if (visible) {
      document
        .getElementsByTagName("aside")[0]
        ?.setAttribute("inert", visible.toString());
      document
        .getElementsByTagName("nav")[0]
        ?.setAttribute("inert", visible.toString());
      document
        .getElementsByClassName("tab-bar")[0]
        ?.setAttribute("inert", visible.toString());
    } else {
      document.getElementsByTagName("aside")[0]?.removeAttribute("inert");
      document.getElementsByTagName("nav")[0]?.removeAttribute("inert");
      document.getElementsByClassName("tab-bar")[0]?.removeAttribute("inert");
    }
  }, [visible]);

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        open={visible}
        onClose={() => {}}
      >
        <Draggable
          cancel=".disable-drag"
          defaultPosition={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }}
          positionOffset={{ x: "-50%", y: "-50%" }}
        >
          <div
            className="modal-window fixed inset-0 z-10 overflow-y-auto"
            style={{ width: "max-content", height: "max-content" }}
          >
            <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                static
              >
                <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl border border-indigo-600 cursor-move">
                  <div className="bg-white">
                    <div className="sm:flex sm:items-start">
                      <div className="text-left w-full">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {title}
                        </Dialog.Title>
                        <div className="mt-2 px-4">{children}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {buttons}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Draggable>
      </Dialog>
    </Transition.Root>
  );
};

export default DraggableModal;
