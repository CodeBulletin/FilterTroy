import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./Theme/Dialog.scss";

const DialogCard = (props) => (
  <Dialog.Root open={props.open}>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">{props.heading}</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          {props.info}
        </Dialog.Description>
        <div className="ErrorContainer">
          <label className="Error">{props.error}</label>
        </div>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            {props.label}
          </label>
          <input
            className="Input"
            id="name"
            value={props.value}
            onChange={props.onChange}
          />
        </fieldset>
        <div
          style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
        >
          <Dialog.Close asChild>
            <button
              className="Button"
              onClick={(e) => {
                props.onEventSucess(e);
              }}
            >
              {props.buttonText}
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button
            className="IconButton"
            aria-label="Close"
            onClick={props.onOpenChange}
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogCard;
