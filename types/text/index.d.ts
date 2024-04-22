export interface CompiledWordPattern {
	includesWordStart: boolean;
	includesWordEnd: boolean;
	regexp: RegExp;
}

export type CensoredTextItem<CensoredTextElement> = string | CensoredTextElement;
export type CensoredText<CensoredTextElement> = CensoredTextItem<CensoredTextElement>[];

export function compileWordPatterns(patterns: string[], language?: string): CompiledWordPattern[];
export function censorWords<CensoredTextElement>(text: string, filters: CompiledWordPattern[]): string | CensoredText<CensoredTextElement>;

export interface TrimTextOptions {
	getCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number;
	minFitFactor?: number;
	maxFitFactor?: number;
	trimPoint?: string;
	trimMarkEndOfLine?: string;
	trimMarkEndOfSentence?: string;
	trimMarkEndOfWord?: string;
	trimMarkAbrupt?: string;
}

export function trimText(text: string, maxLength: number, options?: TrimTextOptions): string | undefined;

export function unescapeText(string: string): string;
