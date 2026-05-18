import React from "react";

declare global {
  namespace React {
    type ReactNode = import("react").ReactNode;
    type FC<P = {}> = import("react").FC<P>;
    type ComponentType<P = {}> = import("react").ComponentType<P>;
    type ReactElement = import("react").ReactElement;
    type CSSProperties = import("react").CSSProperties;
    type RefObject<T> = import("react").RefObject<T>;
    type MutableRefObject<T> = import("react").MutableRefObject<T>;
    type Dispatch<A> = import("react").Dispatch<A>;
    type SetStateAction<S> = import("react").SetStateAction<S>;
    type ChangeEvent<T = Element> = import("react").ChangeEvent<T>;
    type FormEvent<T = Element> = import("react").FormEvent<T>;
    type MouseEvent<T = Element> = import("react").MouseEvent<T>;
    type KeyboardEvent<T = Element> = import("react").KeyboardEvent<T>;
    type ClipboardEvent<T = Element> = import("react").ClipboardEvent<T>;
    type HTMLAttributes<T> = import("react").HTMLAttributes<T>;
    type ButtonHTMLAttributes<T> = import("react").ButtonHTMLAttributes<T>;
    type InputHTMLAttributes<T> = import("react").InputHTMLAttributes<T>;
    type TextareaHTMLAttributes<T> = import("react").TextareaHTMLAttributes<T>;
    type SelectHTMLAttributes<T> = import("react").SelectHTMLAttributes<T>;
    type AnchorHTMLAttributes<T> = import("react").AnchorHTMLAttributes<T>;
    type ImgHTMLAttributes<T> = import("react").ImgHTMLAttributes<T>;
    type SVGProps<T> = import("react").SVGProps<T>;
    type PropsWithChildren<P = unknown> = import("react").PropsWithChildren<P>;
    type ForwardRefExoticComponent<P> = import("react").ForwardRefExoticComponent<P>;
    type ForwardedRef<T> = import("react").ForwardedRef<T>;
    type Context<T> = import("react").Context<T>;
    type Provider<T> = import("react").Provider<T>;
    type Consumer<T> = import("react").Consumer<T>;
    type Reducer<S, A> = import("react").Reducer<S, A>;
    type ReducerState<R extends Reducer<any, any>> = import("react").ReducerState<R>;
    type ReducerAction<R extends Reducer<any, any>> = import("react").ReducerAction<R>;
    type DependencyList = import("react").DependencyList;
    type EffectCallback = import("react").EffectCallback;
    type ComponentProps<T extends keyof JSX.IntrinsicElements | import("react").JSXElementConstructor<any>> = import("react").ComponentProps<T>;
    type ComponentPropsWithRef<T extends import("react").ElementType> = import("react").ComponentPropsWithRef<T>;
    type ComponentPropsWithoutRef<T extends import("react").ElementType> = import("react").ComponentPropsWithoutRef<T>;
    type ElementRef<C extends import("react").ElementType> = import("react").ElementRef<C>;
    type ElementType<P = any> = import("react").ElementType<P>;
  }
}

export {};
