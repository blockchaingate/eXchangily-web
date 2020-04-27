import {
    Directive,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[decimal]'
})
export class DecimalPrecisionDirective implements OnChanges, AfterViewInit {
    @Input('decimal') size: string;
    @Input('ngModel') _model: NgModel;

    regexStr = '^[0-9]+(.[0-9]{0,1})?$';
    regexStr2 = '^[0-9]+(.[0-9]{0,2})?$';

    curVal: any;
    newSize: number;
    flag: boolean;
    selectFlag = false;
    keyDown = false;
    curPos: any;
    e: KeyboardEvent;

    constructor(public model: NgModel, private el: ElementRef) { }

    ngAfterViewInit() {
        this.el.nativeElement.style.textAlign = 'right';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes) { return; }
        let regEx2 = new RegExp(this.regexStr);

        // On First Change...
        if (changes._model && changes._model.firstChange) {
            this.newSize = parseInt(changes.size.currentValue);
            this.regexStr = '^[0-9]+(.[0-9]{0,' + this.newSize + '})?$';
            regEx2 = new RegExp(this.regexStr);
            this.checkRegEx();
            this.checkFlag();

            // While test fails
            if (!regEx2.test(changes._model.currentValue)) {
                setTimeout(() => {
                    this.curVal = '';
                    this.model.model = '';
                    this.model.valueAccessor.writeValue('');
                    this.curPos = this.el.nativeElement.selectionStart;
                });
            }

            // While test passes..
            if (regEx2.test(changes._model.currentValue)) {
                if (!this.size) {
                    if (Number(this.size) !== 0) {
                        setTimeout(() => {
                            this.model.valueAccessor.writeValue(
                                parseFloat('' + changes._model.currentValue + '').toFixed(2)
                            );
                            this.curVal = parseFloat(
                                '' + changes._model.currentValue + ''
                            ).toFixed(2);
                            this.model.model = parseFloat(
                                '' + changes._model.currentValue + ''
                            ).toFixed(2);
                            this.curPos = this.el.nativeElement.selectionStart;
                        });
                    } else {
                        setTimeout(() => {
                            this.model.valueAccessor.writeValue(
                                '' + changes._model.currentValue + ''
                            );
                            this.curVal = '' + changes._model.currentValue + '';
                            this.model.model = '' + changes._model.currentValue + '';
                            this.curPos = this.el.nativeElement.selectionStart;
                        });
                    }
                } else {
                    setTimeout(() => {
                        this.model.valueAccessor.writeValue(
                            parseFloat('' + changes._model.currentValue + '').toFixed(
                                Number(this.size)
                            )
                        );
                        this.curVal = parseFloat(
                            '' + changes._model.currentValue + ''
                        ).toFixed(Number(this.size));
                        this.model.model = parseFloat(
                            '' + changes._model.currentValue + ''
                        ).toFixed(Number(this.size));
                        this.curPos = this.el.nativeElement.selectionStart;
                    });
                }

                // flag for . (dot)
                this.flag = true;
            }
        }

        // On More Changes..
        if (changes._model && !changes._model.firstChange) {
            this.regexStr = '^[0-9]+(.[0-9]{0,' + (this.newSize - 1) + '})?$';
            regEx2 = new RegExp(this.regexStr);
            if (regEx2.test(changes._model.currentValue)) {
                if (!this.keyDown) {
                    if (!this.size) {
                        setTimeout(() => {
                            this.model.valueAccessor.writeValue(
                                parseFloat('' + changes._model.currentValue + '').toFixed(2)
                            );
                            this.curVal = parseFloat(
                                '' + changes._model.currentValue + ''
                            ).toFixed(2);
                            this.model.model = parseFloat(
                                '' + changes._model.currentValue + ''
                            ).toFixed(2);
                            this.curPos = this.el.nativeElement.selectionStart;
                        });
                    } else {
                        if (this.size === '0') {
                            this.curVal = changes._model.currentValue;
                        } else {
                            setTimeout(() => {
                                this.model.valueAccessor.writeValue(
                                    parseFloat('' + changes._model.currentValue + '').toFixed(
                                        Number(this.size)
                                    )
                                );
                                this.curVal = parseFloat(
                                    '' + changes._model.currentValue + ''
                                ).toFixed(Number(this.size));
                                this.model.model = parseFloat(
                                    '' + changes._model.currentValue + ''
                                ).toFixed(Number(this.size));
                                this.curPos = this.el.nativeElement.selectionStart;
                            });
                        }
                    }
                } else {
                    this.curVal = changes._model.currentValue;
                }
            } else {
                this.curVal = changes._model.currentValue;
                this.curPos = this.el.nativeElement.selectionStart;
            }
            this.curVal = changes._model.currentValue;
        }
    }

    // HostListener for Keydown
    @HostListener('keydown', ['$event']) onKeyDown(event) {
        this.keyDown = true;
        // select flag disable
        if (!(event.ctrlKey || event.keyCode === 65 || event.keyCode === 97)) {
            setTimeout(x => {
                this.selectFlag = false;
            }, 100);
        }
        this.e = event;
        setTimeout(() => {
            this.curPos = this.el.nativeElement.selectionStart;
        });
        if (!this.size) {
            if (this.newSize !== 2) {
                this.newSize = 2;
            }
        }
        this.checkDecimal();
    }

    // HostListener for MouseUp
    @HostListener('mouseup', ['$event']) onmouseup(event) {
        this.e = event;
        this.selectFlag = false;
        setTimeout(() => {
            this.curPos = this.el.nativeElement.selectionStart;
        });
    }
    // Select value from input text
    getSelection(): boolean {
        if (
            window
                .getSelection()
                .toString()
                .includes('.')
        ) {
            return true;
        } else {
            return false;
        }
    }
    // HostListener for Selection
    @HostListener('select', ['$event']) onselect(event) {
        this.selectFlag = this.getSelection();
    }
    // HostListener for Keyup
    @HostListener('keyup', ['$event']) onkeyUp(event) {
        this.keyDown = false;
        if (event.ctrlKey) {
            if (event.keyCode === 65 || event.keyCode === 97) {
                this.selectFlag = this.getSelection();
            }
        }
        this.e = event;
        if (event.target.value === '') {
            this.flag = false;
        }
        this.checkRegEx();
        this.checkFlag();
        this.model.model = this.el.nativeElement.value;
    }

    // HostListener for OnFocus
    @HostListener('focus', ['$event']) onFocus(event) {
        event.target.value = '';
    }

    // HostListener for OnBlur
    @HostListener('blur', ['$event']) onBlur(event) {
        if (this.size) {
            if (event.keyCode === 8 || event.keyCode === 9) {
                return;
            }
            if (event.target.value === '') {
                return;
            }
            if (event.target.value === 'NaN') {
                return;
            }
            if (event.target.value === '.') {
                this.model.valueAccessor.writeValue('');
                return;
            }
            setTimeout(() => {
                this.model.valueAccessor.writeValue(
                    parseFloat('' + event.target.value + '').toFixed(Number(this.size))
                );
                this.model.model = parseFloat('' + event.target.value + '').toFixed(
                    Number(this.size)
                );
            });
        } else {
            if (event.keyCode === 8 || event.keyCode === 9) {
                return;
            }
            if (event.target.value === '') {
                return;
            }
            if (event.target.value === 'NaN') {
                return;
            }
            if (event.target.value === '.') {
                this.model.valueAccessor.writeValue('');
                return;
            }
            if (Number(this.size) !== 0) {
                setTimeout(() => {
                    this.model.valueAccessor.writeValue(
                        parseFloat('' + event.target.value + '').toFixed(2)
                    );
                    this.model.model = parseFloat('' + event.target.value + '').toFixed(
                        2
                    );
                });
            }
        }
        console.log('value', event.target.value);
        console.log('model', this._model);
    }

    // HostListener for paste
    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const paste = event.clipboardData.getData('text/plain');
        if (/^\d+\.\d{0,2}/g.test(paste)) {
            document.execCommand('insertText', false, paste);
            return;
        }
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // get a digit-only string
        document.execCommand('insertText', false, pastedInput);
    }

    private checkDecimal(): void {
        if (
            [46, 8, 9, 27, 13].indexOf(this.e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (this.e.keyCode === 65 && this.e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (this.e.keyCode === 67 && this.e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (this.e.keyCode === 86 && this.e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (this.e.keyCode === 88 && this.e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (this.e.keyCode >= 35 && this.e.keyCode <= 39)
        ) {
            return;
        }
        // Check special char
        if (
            (this.e.keyCode >= 48 &&
                this.e.keyCode <= 57 &&
                this.e.shiftKey === true) ||
            (this.e.keyCode <= 190 && this.e.shiftKey === true)
        ) {
            this.e.preventDefault();
        }
        if (this.e.keyCode === 190 || this.e.keyCode === 110) {
            if (this.size === '0') {
                this.e.preventDefault();
            }
        }
        const ch = String.fromCharCode(this.e.keyCode);
        let s = '';
        let i: number;
        this.regexStr = '^[0-9]+(.[0-9]{0,' + (this.newSize - 1) + '})?$';
        this.regexStr2 = '^[0-9]+(.[0-9]{0,' + this.newSize + '})?$';
        const regEx = new RegExp(this.regexStr);
        const regEx3 = new RegExp(this.regexStr2);

        if (
            regEx.test(ch) ||
            this.e.keyCode === 190 ||
            this.e.keyCode === 110 ||
            (this.e.keyCode >= 96 && this.e.keyCode <= 105)
        ) {
            if (this.flag) {
                if (this.e.keyCode === 190 || this.e.keyCode === 110) {
                    if (!this.selectFlag) {
                        this.e.preventDefault();
                    }
                    return;
                }
            }

            if (!regEx.test(this.model.model)) {
                if (this.curVal === '' || this.model.model === '') {
                    return;
                }

                if (regEx3.test(this.model.model)) {
                    if (String(this.model.model).includes('.')) {
                        s = String(this.model.model);
                        i = s.indexOf('.');
                        if (
                            typeof this.size !== 'undefined' &&
                            this.size != null &&
                            this.size !== ''
                        ) {
                            if (this.curPos <= s.length - (Number(this.size) + 1)) {
                                return;
                            } else {
                            }
                        } else {
                            if (this.curPos <= s.length - (this.newSize + 1)) {
                                return;
                            }
                        }
                    }
                }

                if (String(this.model.model).startsWith('.')) {
                    if (
                        new RegExp('^(.[0-9]{0,' + (this.newSize - 1) + '})?$').test(
                            this.model.model
                        )
                    ) {
                        return;
                    } else {
                        this.e.preventDefault();
                    }
                }

                if (new RegExp('^(.[0-9]{0,' + this.newSize + '})?$').test(this.model.model)) {
                    return;
                }
                
                this.e.preventDefault();
                return;
            }

            if (regEx.test(this.model.model)) {
                if (!String(this.model.model).includes('.')) {
                    s = String(this.model.model);
                    if (
                        typeof this.size !== 'undefined' &&
                        this.size != null &&
                        this.size !== ''
                    ) {
                        if (this.curPos > s.length - (this.newSize + 1)) {
                            return;
                        } else {
                            // if (this.size != '0') {
                            //   debugger;
                            //   this.e.preventDefault();
                            // }
                        }
                    } else {
                        if (this.curPos > s.length - (this.newSize + 1)) {
                            return;
                        } else {
                            if (!this.size) { return; }
                            this.e.preventDefault();
                        }
                    }
                } else {
                }
            }
            return;
        } else {
            this.e.preventDefault();
        }
    }
    // check RegEx
    private checkRegEx(): boolean {
        const regEx = new RegExp(this.regexStr);
        if (String(this.model.model).endsWith('.')) {
            if (!this.flag) {
                this.flag = true;
            }
        }
        if (String(this.model.model).includes('.')) {
            if (!this.flag) {
                this.flag = true;
            }
        }
        if (regEx.test(this.model.model)) {
            return true;
        } else {
            return false;
        }
    }

    // Check Flag
    private checkFlag() {
        if (!String(this.model.model).includes('.')) {
            this.flag = false;
        }
    }
}
