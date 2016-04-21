import {
    Directive,
    Host,
    Optional,
    SkipSelf,
    OnInit,
    DoCheck,
    KeyValueDiffers,
    KeyValueDiffer,
    KeyValueChangeRecord,
    Renderer,
    ElementRef
} from 'angular2/core';

@Directive({
    selector: '[bem]',
    inputs: ['block: bem', 'modifiers: --']
})
export class BemDirective implements OnInit, DoCheck {
    private _block: string;
    private _modifiers: { [key: string]: boolean };
    private _keyValueDiffer: KeyValueDiffer;
    isRoot: boolean;

    constructor(
        @Optional() @Host() @SkipSelf() private _parent: BemDirective,
        private _keyValueDiffers: KeyValueDiffers,
        private _ngEl: ElementRef,
        private _renderer: Renderer
    ) { }

    set block(v: string) {
        this._block = (v || '').trim();
    }

    set modifiers(v: { [key: string]: boolean }) {
        this._modifiers = v || {};
    }

    get blockPath() {
        return this.isRoot ? this._block : this._parent.blockPath + this._block;
    }

    ngOnInit() {
        this.isRoot = !/^__/.test(this._block);
        this._keyValueDiffer = this._keyValueDiffers.find(this._modifiers).create(null);
        this._toggleClass(this.blockPath, true);
    }

    ngDoCheck() {
        let changes = this._keyValueDiffer.diff(this._modifiers);
        if (!changes) return;
        changes.forEachAddedItem((record: KeyValueChangeRecord) => {
            this._toggleModifier(record.key, record.currentValue);
        });
        changes.forEachChangedItem((record: KeyValueChangeRecord) => {
            this._toggleModifier(record.key, record.currentValue);
        });
        changes.forEachRemovedItem((record: KeyValueChangeRecord) => {
            record.previousValue && this._toggleModifier(record.key, false);
        });
    }

    private _toggleModifier(modifier: string, enabled: boolean) {
        modifier = modifier.trim();
        this._toggleClass(`${this.blockPath}--${modifier}`, enabled);
    }

    private _toggleClass(className: string, enabled: boolean) {
        this._renderer.setElementClass(this._ngEl.nativeElement, className, enabled);
    }
}
