import { mount } from '@vue/test-utils'
import TdbLoginForm from '@/components/molecules/TdbLoginForm.vue'
import { domainToASCII } from 'url';
import { on } from 'cluster';

describe('TdbLoginFrom', () => {
  describe('プロパティ', () => {
    describe('validation', () => {
      let loginFrom
      // 各テストごとの始まる前の処理
      beforeEach(done => {
        loginFrom = mount(TdbLoginForm, {
          propsData: { onlogin: () => {} }
        })
        // `vm`はvue のインスタンス。wrapper.vm を使って vm のプロパティとインスタンスメソッドにアクセス可能
        // `vm.$nextTickはcallback の実行を遅延し、DOM の更新サイクル後に実行するためのメソッド`
        loginFrom.vm.$nextTick(done)
      })
      // emailのバリデーション
      describe('email', () => {
        // 入力、未入力のテストケース
        describe('require', () => {
          // 未入力
          describe('何も入力されていない', () => {
            it('validation.email.requiredがinvalidであること', () => {
              loginFrom.setDate({email: ''})
              expect(loginFrom.vm.validation.email.required).to.equal(false)
            })
          })
          // 入力あり
          describe('入力あり', () => {
            it('validation.email.requiredがvalidであること', () => {
              loginFrom.setDate({email: 'foo@domain.com'})
              expect(loginFrom.vm.validation.email.required).to.equal(true)
            })
          })
        })

        // 入力された値のフォーマットのテストケース
        describe('format', () => {
          // 不正な形式
          describe('メールアドレス形式でないフォーマット', () => {
            it('validation.email.formatがinvalidであること', () => {
              loginFrom.setDate({email: 'foobar'})
              expect(loginFrom.vm.validation.email.format).to.equal(false)
            })
          })
          // 正しい形式
          describe('メールアドレス形式のフォーマット', () => {
            it('validation.email.formatがvalidであること', () => {
              loginFrom.setDate({email: 'foo@domain.com'})
              expect(loginFrom.vm.validation.email.format).to.equal(true)
            })
          })
        })
      })

      // passwordのバリデーション
      describe('password', () => {
        describe('required', () => {
          // 未入力
          describe('何も入力されていない', () => {
            it('validation.password.requiredがinvalidであること', () => {
              loginFrom.setDate({password: ''})
              expect(loginFrom.vm.validation.password.required).to.equal(false)
            })
          })
          // 入力
          describe('入力あり', () => {
            it('validation.password.requiredがvalidであること', () => {
              loginFrom.setDate({password: 'xxxx'})
              expect(loginFrom.vm.validation.password.required).to.equal(true)
            })
          })
        })
      })
    })

    // バリデーション通貨判定のテスト
    describe('valid', () => {
      let loginFrom
      beforeEach(done => {
        loginFrom = mount(TdbLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginFrom.vm.$nextTick(done)
      })

      describe('バリデーション項目すべてOK', () => {
        it('validになること', () => {
          loginFrom.setDate({
            email: 'foo@domain.com',
            password: '1234567'
          })
          expect(loginFrom.vm.valid).to.equal(true)
        })
      })

      describe('バリデーション項目にNGがある', () => {
        it('invalidになること', () => {
          loginFrom.setDate({
            email: 'foo@domain.com',
            password: ''
          })
          expect(loginFrom.vm.valid).to.equal(false)
        })
      })
    })

    // ログイン処理のテスト
    describe('disableLoginAction', () => {
      let loginFrom
      beforeEach(done => {
        loginFrom = mount(TdbLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginFrom.vm.$nextTick(done)
      })

      describe('バリデーションNG項目あり', () => {
        it('ログイン処理は無効', () => {
          loginFrom.setDate({
            email: 'foo@domain.com',
            password: ''
          })
          expect(loginFrom.vm.disableLoginAction).to.equal(true)
        })
      })

      describe('バリデーション項目すべてOKかつログイン処理中ではない', () => {
        it('ログイン処理は有効', () => {
          loginFrom.setDate({
            email: 'foo@domain.com',
            password: '124567'
          })
          expect(loginFrom.vm.disableLoginAction).to.equal(false)
        })
      })

      describe('バリデーション項目すべてOKかつログイン処理中', () => {
        it('ログイン処理は有効', () => {
          loginFrom.setDate({
            email: 'foo@domain.com',
            password: '124567',
            progress: true
          })
          expect(loginFrom.vm.disableLoginAction).to.equal(true)
        })
      })
    })

    // ログインボタンクリック時の状態にまつわるテスト
    describe('onlogin', () => {
      let loginFrom
      let onloginStub
      beforeEach(done => {
        onloginStub = 
        loginFrom = mount(TdbLoginForm, {
          propsData: { onlogin: onloginStub }
        })
        loginFrom.setData({
          email: 'foo@domain.com',
          password: '1234567'
        })
        loginFrom.vm.$nextTick(done)
      })

      describe('resolve', () => {
        it('resolveされること', done => {
          onloginStub.reslves()

          // クリックイベント
          loginFrom.find('button').trigger('click')
          expect(onloginStub.called).to.equal(false) // まだresolveされない
          expect(loginFrom.vm.error).to.equal('') // エラーメッセージは初期化
          expect(loginFrom.vm.disableLoginAction).to.equal(true) // ログインアクションは不可

          // 状態の反映
          loginFrom.vm.$nextTick(() => {
            expect(onloginStub.called).to.equal(true) // まだresolveされた
            const authInfo = onloginStub.args[0][0]
            expect(authInfo.email).to.equal(loginFrom.vm.email)
            expect(authInfo.password).to.equal(loginFrom.vm.password)
            loginFrom.vm.$nextTick(() => {
              // resolve内での状態の反映
              expect(loginFrom.vm.error).to.equal('') // エラーメッセージは初期化のまま
              expect(loginFrom.vm.disableLoginAction).to.equal(false) // ログインアクションは可能
              done()
            })
          })
        })
      })

      describe('reject', () => {
        it('rejectされること', done => {
          onloginStub.rejects(new Error('login error!'))

          // クリックイベント
          loginFrom.find('button').trigger('click')
          expect(onloginStub.called).to.equal(false) // まだrejectされない
          expect(loginFrom.vm.error).to.equal('') // エラーメッセージは初期化
          expect(loginFrom.vm.disableLoginAction).to.equal(true) // ログインアクションは不可

          // 状態の反映
          loginFrom.vm.$nextTick(() => {
            expect(onloginStub.called).to.equal(true) // まだrejectされた
            const authInfo = onloginStub.args[0][0]
            expect(authInfo.email).to.equal(loginFrom.vm.email)
            expect(authInfo.password).to.equal(loginFrom.vm.password)
            loginFrom.vm.$nextTick(() => {
              expect(loginFrom.vm.error).to.equal('login error!') // エラーメッセージが設定される
              expect(loginFrom.vm.disableLoginAction).to.equal(false) // ログインアクションは可能
              done()
            })
          })
        })
      })
    })
  })
})
