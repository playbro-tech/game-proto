import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { create, fromBinary, fromJson, toBinary, toJson } from '@bufbuild/protobuf';
import {
  CommandType,
  GiftModeRequestSchema,
  GiftModeResponseSchema,
  GiftSpinSchema,
  LoginResponseSchema,
  PlayResponseSchema,
  StartResponseSchema,
  SyncResponseSchema,
} from '../src/index';

const offer = {
  bet: '10',
  left: 7,
  total: 10,
  total_bet: '30',
  total_win: '120',
  status: 'started',
};

describe('gift mode wire contract', () => {
  it('keeps existing command numbers and appends the dedicated command', () => {
    assert.deepEqual(
      [CommandType.sync, CommandType.login, CommandType.start, CommandType.play, CommandType.ready],
      [1, 2, 3, 4, 5],
    );
    assert.equal(CommandType.gift_mode, 6);
  });

  for (const paused of [false, true]) {
    it(`encodes an explicit paused=${paused} intent without starting a round`, () => {
      const request = create(GiftModeRequestSchema, {
        command: CommandType.gift_mode,
        sessionId: 'test-session',
        signKey: 'test-sign',
        paused,
      });
      assert.deepEqual(toJson(GiftModeRequestSchema, request, { useProtoFieldName: true }), {
        command: 'gift_mode',
        session_id: 'test-session',
        sign_key: 'test-sign',
        paused,
      });
      assert.equal(fromBinary(GiftModeRequestSchema, toBinary(GiftModeRequestSchema, request)).paused, paused);
    });

    it(`decodes confirmed paused=${paused} from the root response, not a play context`, () => {
      const response = fromJson(GiftModeResponseSchema, { gift_spin: { ...offer, paused } });
      assert.equal(response.giftSpin?.paused, paused);
      assert.equal(response.giftSpin?.left, 7);
      assert.equal(response.giftSpin?.totalWin, 120n);
      assert.deepEqual(toJson(GiftModeResponseSchema, response, { useProtoFieldName: true }), {
        gift_spin: { ...offer, paused },
      });
    });
  }

  it('preserves missing intent and unknown server mode separately from explicit false', () => {
    const request = fromJson(GiftModeRequestSchema, { command: 'gift_mode' });
    assert.equal(request.paused, undefined);
    assert.deepEqual(toJson(GiftModeRequestSchema, request), { command: 'gift_mode' });
    const legacyGift = fromJson(GiftSpinSchema, { ...offer, is_previous_gift: true });
    assert.equal(legacyGift.paused, undefined);
    assert.equal(legacyGift.isPreviousGift, true);
    const binaryGift = fromBinary(GiftSpinSchema, toBinary(GiftSpinSchema, legacyGift));
    assert.equal(binaryGift.paused, undefined);
    assert.equal(binaryGift.isPreviousGift, true);
  });

  it('retains authoritative mode through login, sync, start and play containers', () => {
    const gift = { ...offer, paused: true, is_previous_gift: true };
    const login = fromJson(LoginResponseSchema, { gift_spin: gift });
    const sync = fromJson(SyncResponseSchema, { gift_spin: gift });
    const start = fromJson(StartResponseSchema, { context: { gift_spin: gift } });
    const play = fromJson(PlayResponseSchema, { context: { gift_spin: gift } });
    for (const actual of [login.giftSpin, sync.giftSpin, start.context?.giftSpin, play.context?.giftSpin]) {
      assert.equal(actual?.paused, true);
      assert.equal(actual?.isPreviousGift, true);
      assert.equal(actual?.left, 7);
      assert.equal(actual?.totalWin, 120n);
    }
  });

  for (const status of ['finished', 'deleted']) {
    it(`retains ${status} offer data and exact final win without clearing the message`, () => {
      const response = fromJson(PlayResponseSchema, {
        context: { gift_spin: { ...offer, status, left: 0, total_win: '9007199254740993', paused: false } },
      });
      const result = response.context?.giftSpin;
      assert.equal(result?.status, status);
      assert.equal(result?.left, 0);
      assert.equal(result?.total, 10);
      assert.equal(result?.totalWin, 9007199254740993n);
      assert.equal(result?.paused, false);
    });
  }

  it('distinguishes no offer from an existing offer with an explicit unpaused mode', () => {
    assert.equal(fromJson(GiftModeResponseSchema, { gift_spin: null }).giftSpin, undefined);
    assert.equal(fromJson(LoginResponseSchema, {}).giftSpin, undefined);
    assert.equal(fromJson(GiftModeResponseSchema, { gift_spin: { ...offer, paused: false } }).giftSpin?.paused, false);
  });

  it('rejects malformed paused values in requests and confirmed offers', () => {
    for (const paused of ['false', 0, {}]) {
      assert.throws(() => fromJson(GiftModeRequestSchema, { command: 'gift_mode', paused }));
      assert.throws(() => fromJson(GiftModeResponseSchema, { gift_spin: { ...offer, paused } }));
    }
  });
});
