default:
    @just --list

install:
    pnpm install

dev:
    pnpm dev

format:
    pnpm format

lint:
    pnpm lint

check:
    pnpm check
    pnpm build

build:
    pnpm build

start:
    pnpm build
    pnpm start

update:
    pnpm update
